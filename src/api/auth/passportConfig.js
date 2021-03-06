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
const authService = require('./auth.service');
const userService = require('../users/users.service');
const { UnauthorizedError } = require('express-jwt');

//token auth
passport.use(
    'jwt',
    new JWTstrategy(
        {
            //secret we used to sign our JWT
            secretOrKey: process.env.AUTH_TOKEN_SECRET,
            //we expect the user to send the access token in the header
            jwtFromRequest: (req) => {
                if (!req.headers.authorization) return null;
                const tokenFromHeader = req.headers.authorization.replace('Bearer ', '').trim();
                return tokenFromHeader;
            }
        },
        (token, done) => {
            try {
                if (!token || token.type !== tokenType.ACCESS_TOKEN) {
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

//local authentication
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

//custom handler for 3-legged o-auth without session
//https://developer.twitter.com/en/docs/authentication/oauth-1-0a/obtaining-user-access-tokens
passport.use(
    'twitterLogin',
    new customStrategy(async (req, done) => {
        const callbackURL = '/twitter/callback';
        const oauth_request_url = 'https://api.twitter.com/oauth/request_token';
        const oauth_authorize_url = 'https://api.twitter.com/oauth/authorize';
        const oauth_access_url = 'https://api.twitter.com/oauth/access_token';
        const user_profile_url =
            'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true&skip_status=true&include_entities=false';
        //handler handles both performing the initial request for the request token
        //and the received request to the callback url and performing the subsequent authentication request
        if (req.path !== callbackURL) {
            //initial request -  Step 1: POST oauth/request_token
            const oauth = OAuth({
                consumer: { key: process.env.TWITTER_OAUTH_KEY, secret: process.env.TWITTER_OAUTH_SECRET },
                signature_method: 'HMAC-SHA1',
                hash_function: (base_string, key) => crypto.createHmac('sha1', key).update(base_string).digest('base64')
            });
            const request_data = {
                url: oauth_request_url,
                method: 'POST',
                data: { oauth_callback: process.env.TWITTER_CALLBACK }
            };
            const authHeader = oauth.toHeader(oauth.authorize(request_data));
            try {
                const response = await axios.post(request_data.url, {}, { headers: { ...authHeader } });
                const data = querystring.parse(response.data);
                if (!data.oauth_callback_confirmed)
                    req.res.status(500).json({ message: 'An issue occurred with twitter authentication.' });
                //if success redirect the user to the twitter authentication page
                //Step 2: GET oauth/authorize
                else req.res.redirect(`${oauth_authorize_url}?oauth_token=${data.oauth_token}`);
            } catch (err) {
                done(err);
            }
        } else {
            //is a request to our defined callback url
            //Step 3: POST oauth/access_token
            try {
                const { oauth_token, oauth_verifier } = req.query;
                if (!oauth_token || !oauth_verifier) done(null, false, { message: 'Twitter authentication failed.' });
                else {
                    const oauth = OAuth({
                        consumer: { key: process.env.TWITTER_OAUTH_KEY, secret: process.env.TWITTER_OAUTH_SECRET },
                        signature_method: 'HMAC-SHA1',
                        hash_function: (base_string, key) =>
                            crypto.createHmac('sha1', key).update(base_string).digest('base64')
                    });
                    const tokenRequestData = {
                        url: oauth_access_url,
                        method: 'POST',
                        data: { oauth_verifier }
                    };
                    const token = { key: oauth_token };
                    let authHeader = oauth.toHeader(oauth.authorize(tokenRequestData, token));

                    //if this request succeeds the user is now autehtnicated
                    const res = await axios.post(tokenRequestData.url, {}, { headers: { ...authHeader } });
                    const {
                        oauth_token: twitter_oauth_token,
                        oauth_token_secret: twitter_oauth_token_secret
                    } = querystring.parse(res.data);

                    //but we don't have access to all the date we need to create or update their profile
                    //so we also request that
                    const userRequestData = {
                        url: user_profile_url,
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
                    //create or update user with the twitter integration
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
                }
            } catch (err) {
                done(err);
            }
        }
    })
);

//implementation of google authentication strategy
passport.use(
    'googleLogin',
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_OAUTH_KEY,
            clientSecret: process.env.GOOGLE_OAUTH_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK
        },
        async (accessToken, _, profile, done) => {
            //authentication has succeeded, let's use the information to create
            //or update a new user with the google integration
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
