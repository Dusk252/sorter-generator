const express = require('express');
const passport = require('passport');
const router = express.Router();
const axios = require('axios');
const config = require('../config.json');
const crypto = require('crypto');
const querystring = require('querystring');
const OAuth = require('oauth-1.0a');
const userService = require('../users/users.service');
const authService = require('./auth.service');
const { tokenType, accountState } = require('../_helpers/enum');
const { generateAccessToken, generateRefreshToken, getTokenData } = require('./tokenUtil');
const { UnauthorizedError } = require('express-jwt');

//routes
router.post('/register', localSignUp);
router.post('/login', passport.authenticate('login', { session: false }), localLogin);
router.get('/twitter/login', passport.authenticate('twitterLogin', { session: false }));
router.get(
    '/twitter/callback',
    passport.authenticate('twitterLogin', { session: false, failureRedirect: '/login/result' }),
    login
);
router.get('/google/login', passport.authenticate('googleLogin', { scope: ['email', 'profile'], session: false }));
router.get(
    '/google/callback',
    passport.authenticate('googleLogin', { session: false, failureRedirect: '/login/result' }),
    login
);
router.post('/refresh-token', refreshToken);
router.get('/logout', logout);
router.post('/logout', logout);
module.exports = router;

async function localSignUp(req, res, next) {
    const { username, email, password } = req.body;
    userService
        .createUser(username, email, password, '', accountState.ACTIVE)
        .then(() => res.status(200).json({ message: 'Sign up successful.' }))
        .catch((err) => next(err));
}

async function localLogin(req, res, next) {
    try {
        const user = req.user;
        const refreshToken = generateRefreshToken({ id: user._id, role: user.role });
        await authService.updateRefreshToken(user._id, null, refreshToken);
        res.cookie('refresh_token', refreshToken, { httpOnly: true });
        res.status(200).json({ callback: `${req.protocol}://${req.get('host')}/login/result` });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const user = req.user;
        const refreshToken = generateRefreshToken({ id: user._id, role: user.role });
        res.cookie('refresh_token', refreshToken, { httpOnly: true });
        await authService.updateRefreshToken(user._id, null, refreshToken);
        res.redirect(302, `${req.protocol}://${req.get('host')}/login/result`);
    } catch (err) {
        next(err);
    }
}

async function refreshToken(req, res, next) {
    try {
        const old_token = req.cookies.refresh_token;
        const tokenObj = getTokenData(req.cookies.refresh_token);
        const sub = JSON.parse(tokenObj.sub);
        //check if valid refresh token
        const validToken =
            tokenObj.type === tokenType.REFRESH_TOKEN && (await authService.isValidRefreshToken(sub.id, old_token));
        if (validToken) {
            const user = await userService.getById(sub.id);
            const accessToken = generateAccessToken({ id: user._id, role: user.role });
            const refreshToken = generateRefreshToken({ id: user._id, role: user.role });
            //invalidate old token and save the new one
            await authService.updateRefreshToken(user._id, old_token, refreshToken);
            res.cookie('refresh_token', refreshToken, { httpOnly: true });
            res.status(200).json({ accessToken, user });
        } else throw new UnauthorizedError(401, { message: 'Invalid refresh token.' });
    } catch (error) {
        next(error);
    }
}

async function logout(req, res) {
    try {
        //invalidate current refresh token if it exists
        if (req.cookies.refresh_token) await authService.deleteRefreshToken(req.cookies.refresh_token);
        res.cookie('refresh_token', '', { httpOnly: true });
        res.status(200).end();
    } catch (error) {
        next(error);
    }
}
