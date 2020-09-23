const express = require('express');
const passport = require('passport');
const router = express.Router();
const userService = require('./../users/users.service');
const authService = require('./authentication.service');
const { generateAccessToken, generateRefreshToken } = require('./tokenUtil');
const { UnauthorizedError } = require('express-jwt');
const { EvalSourceMapDevToolPlugin } = require('webpack');

//routes
router.post('/register', localSignUp);
router.post('/login', passport.authenticate('login', { session: false }), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
//router.post('/login-twitter-request', twitterLoginReq);
//router.post('/login-twitter-access', twitterLoginAcc);
module.exports = router;

const generateTokens = async (res, user, old_token) => {
    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role });
    //invalidate old token and save the new one
    await authService.updateRefreshToken(user._id, old_token, refreshToken);
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    res.status(200).json({ accessToken, user });
};

async function localSignUp(req, res, next) {
    const { username, email, password } = req.body;
    userService
        .createUser(username, email, password, '', 'Active')
        .then(() => res.status(200).json({ message: 'Sign up successful.' }))
        .catch((err) => next(err));
}

async function login(req, res, next) {
    try {
        const user = req.user;
        generateTokens(res, user, null);
    } catch (err) {
        next(err);
    }
}

async function refreshToken(req, res, next) {
    try {
        const token = req.cookies.refresh_token;
        const validToken = await authService.isValidRefreshToken(token.userId, token);
        if (validToken) {
            const user = await userService.getById(userId);
            generateTokens(res, user, token);
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
