const express = require('express');
const passport = require('passport');
const router = express.Router();
const axios = require('axios');
const config = require('../config.json');
const crypto = require('crypto');
const querystring = require('querystring');
const OAuth = require('oauth-1.0a');
const userService = require('./../users/users.service');
const authService = require('./authentication.service');
const { tokenType, accountState } = require('../_helpers/enum');
const { generateAccessToken, generateRefreshToken, getTokenData } = require('./tokenUtil');
const { UnauthorizedError } = require('express-jwt');

//routes
router.post('/register', localSignUp);
router.post('/login', passport.authenticate('login', { session: false }), login);
router.get('/twitter/login', twitterLogin);
router.get('/twitter/callback', passport.authenticate('twitterLogin', { session: false }), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
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
        .createUser(username, email, password, '', accountState.ACTIVE)
        .then(() => res.status(200).json({ message: 'Sign up successful.' }))
        .catch((err) => next(err));
}

async function twitterLogin(_, res, next) {
    const oauth = OAuth({
        consumer: { key: config.oauth_twitter_key, secret: config.oauth_twitter_secret },
        signature_method: 'HMAC-SHA1',
        hash_function: (base_string, key) => crypto.createHmac('sha1', key).update(base_string).digest('base64')
    });
    const request_data = {
        url: config.oauth_twitter_request_url,
        method: 'POST',
        data: { oauth_callback: config.oauth_callback }
    };
    const authHeader = oauth.toHeader(oauth.authorize(request_data));
    try {
        const response = await axios.post(request_data.url, {}, { headers: { ...authHeader } });
        const data = querystring.parse(response.data);
        if (!data.oauth_callback_confirmed)
            res.status(500).json({ message: 'An issue occurred with twitter authentication.' });
        else res.redirect(`${config.oauth_twitter_authorize_url}?oauth_token=${data.oauth_token}`);
    } catch (err) {
        next(err);
    }
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
        const tokenObj = getTokenData(req.cookies.refresh_token);
        const sub = JSON.parse(tokenObj.sub);
        //check if valid refresh token
        const validToken =
            tokenObj.type === tokenType.REFRESH_TOKEN && (await authService.isValidRefreshToken(sub.id, token));
        if (validToken) {
            const user = await userService.getById(sub.id);
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
