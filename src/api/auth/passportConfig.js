const passport = require('passport');
const axios = require('axios');
const JWTstrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local').Strategy;
const customStrategy = require('passport-custom').Strategy;
const googleStrategy = require('passport-google-oauth2').Strategy;
const crypto = require('crypto');
const querystring = require('querystring');
const OAuth = require('oauth-1.0a');
const { tokenType, accountState } = require('../_helpers/enum');
const config = require('../config.json');
const authService = require('./auth.service');
const userService = require('../users/users.service');
const { UnauthorizedError } = require('express-jwt');

//token auth
passport.use(
    'jwt',
    new JWTstrategy(
        {
            //secret we used to sign our JWT
            secretOrKey: config.auth_token_secret,
            //we expect the user to send the access token in the header
            jwtFromRequest: (req) => {
                if (!req.headers.authorization) throw new UnauthorizedError(401, { message: 'Access token not provided.' });
                const tokenFromHeader = req.headers.authorization.replace('Bearer ', '').trim();
                return tokenFromHeader;
            }
        },
        (token, done) => {
            try {
                if (token.type !== tokenType.ACCESS_TOKEN) {
                    throw new UnauthorizedError(401, { message: 'Access token not provided.' });
                }
                done(null, JSON.parse(token.sub));
            } catch (err) {
                console.error('Token is not valid:', err.message);
                done(err);
            }
        }
    )
);
//local auth
passport.use(
    'login',
    new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await authService.authenticate(email, password);
                if (user) {
                    done(null, user, { message: 'Login successful.' });
                } else done(null, false, { message: 'Username or password is incorrect.' });
            } catch (err) {
                done(err);
            }
        }
    )
);

passport.use(
    'twitterLogin',
    new customStrategy(async (req, done) => {
        const callbackURL = '/twitter/callback';
        if (req.path !== callbackURL) {
            const oauth = OAuth({
                consumer: { key: config.twitter.oauth_key, secret: config.twitter.oauth_secret },
                signature_method: 'HMAC-SHA1',
                hash_function: (base_string, key) => crypto.createHmac('sha1', key).update(base_string).digest('base64')
            });
            const request_data = {
                url: config.twitter.oauth_request_url,
                method: 'POST',
                data: { oauth_callback: 'http://localhost:3000/api/auth/twitter/callback' }
            };
            const authHeader = oauth.toHeader(oauth.authorize(request_data));
            try {
                const response = await axios.post(request_data.url, {}, { headers: { ...authHeader } });
                const data = querystring.parse(response.data);
                if (!data.oauth_callback_confirmed)
                    req.res.status(500).json({ message: 'An issue occurred with twitter authentication.' });
                else req.res.redirect(`${config.twitter.oauth_authorize_url}?oauth_token=${data.oauth_token}`);
            } catch (err) {
                console.log(err);
                done(err);
            }
        } else {
            try {
                const { oauth_token, oauth_verifier } = req.query;
                const oauth = OAuth({
                    consumer: { key: config.twitter.oauth_key, secret: config.twitter.oauth_secret },
                    signature_method: 'HMAC-SHA1',
                    hash_function: (base_string, key) => crypto.createHmac('sha1', key).update(base_string).digest('base64')
                });
                const tokenRequestData = {
                    url: config.twitter.oauth_access_url,
                    method: 'POST',
                    data: { oauth_verifier }
                };
                const token = { key: oauth_token };
                let authHeader = oauth.toHeader(oauth.authorize(tokenRequestData, token));
                const res = await axios.post(tokenRequestData.url, {}, { headers: { ...authHeader } });
                const {
                    oauth_token: twitter_oauth_token,
                    oauth_token_secret: twitter_oauth_token_secret
                } = querystring.parse(res.data);
                const userRequestData = {
                    url: config.twitter.user_profile_url,
                    method: 'GET'
                };
                const accessToken = { key: twitter_oauth_token, secret: twitter_oauth_token_secret };
                authHeader = oauth.toHeader(oauth.authorize(userRequestData, accessToken));
                const { data: profileData } = await axios({
                    method: 'GET',
                    url: userRequestData.url,
                    headers: { ...authHeader }
                });
                const twitterProfile = {
                    id: profileData.id_str,
                    name: profileData.name,
                    screen_name: profileData.screen_name,
                    oauth_token: twitter_oauth_token,
                    oauth_token_secret: twitter_oauth_token_secret
                };
                let user = await userService.getByEmail(profileData.email);
                if (user) {
                    user = await userService.updateUser(
                        { _id: user._id },
                        {
                            $set: { 'integration3rdparty.twitter': twitterProfile }
                        },
                        true
                    );
                } else {
                    user = await userService.createUser(
                        profileData.name,
                        profileData.email.toLowerCase(),
                        null,
                        profileData.profile_image_url.replace('_normal', ''),
                        accountState.ACTIVE,
                        { twitter: twitterProfile }
                    );
                }
                done(null, user, { message: 'Login successful.' });
            } catch (err) {
                done(err);
            }
        }
    })
);

passport.use(
    'googleLogin',
    new googleStrategy(
        {
            clientID: config.google.oauth_key,
            clientSecret: config.google.oauth_secret,
            callbackURL: 'http://localhost:3000/api/auth/google/callback'
        },
        async (accessToken, _, profile, done) => {
            const googleProfile = {
                id: profile.id,
                name: profile.displayName,
                oauth_token: accessToken
            };
            let user = await userService.getByEmail(profile.email);
            if (user) {
                user = await userService.updateUser(
                    { _id: user._id },
                    {
                        $set: { 'integration3rdparty.google': googleProfile }
                    },
                    true
                );
            } else {
                user = await userService.createUser(
                    profile.displayName,
                    profile.email.toLowerCase(),
                    null,
                    profile.picture.replace('_normal', ''),
                    accountState.ACTIVE,
                    { google: googleProfile }
                );
            }
            done(null, user, { message: 'Login successful.' });
        }
    )
);
