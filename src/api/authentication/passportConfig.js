const passport = require('passport');
const axios = require('axios');
const JWTstrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local').Strategy;
const customStrategy = require('passport-custom').Strategy;
const crypto = require('crypto');
const querystring = require('querystring');
const OAuth = require('oauth-1.0a');
const { tokenType, accountState } = require('../_helpers/enum');
const config = require('../config.json');
const authService = require('../authentication/authentication.service');
const userService = require('../users/users.service');
const { UnauthorizedError } = require('express-jwt');

//token auth
passport.use(
    'jwt',
    new JWTstrategy(
        {
            //secret we used to sign our JWT
            secretOrKey: config.authentication_token_secret,
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
        try {
            const { oauth_token, oauth_verifier } = req.query;
            const oauth = OAuth({
                consumer: { key: config.oauth_twitter_key, secret: config.oauth_twitter_secret },
                signature_method: 'HMAC-SHA1',
                hash_function: (base_string, key) => crypto.createHmac('sha1', key).update(base_string).digest('base64')
            });
            const tokenRequestData = {
                url: config.oauth_twitter_access_url,
                method: 'POST',
                data: { oauth_verifier }
            };
            const token = { key: oauth_token };
            let authHeader = oauth.toHeader(oauth.authorize(tokenRequestData, token));
            const res = await axios.post(tokenRequestData.url, {}, { headers: { ...authHeader } });
            const { oauth_token: twitter_oauth_token, oauth_token_secret: twitter_oauth_token_secret } = querystring.parse(
                res.data
            );
            const userRequestData = {
                url: config.twitter_user_profile_url,
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
                    user._id,
                    {
                        $addToSet: { integration3rdparty: { twitter: twitterProfile } }
                    },
                    true
                );
            } else {
                user = await userService.createUser(
                    profileData.name,
                    profileData.email,
                    null,
                    profileData.profile_image_url.replace('_normal', ''),
                    accountState.ACTIVE,
                    [{ twitter: twitterProfile }]
                );
            }
            done(null, user, { message: 'Login successful.' });
        } catch (err) {
            done(err);
        }
    })
);
