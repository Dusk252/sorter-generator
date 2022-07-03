const passport = require('passport');
const axios = require('axios');
const JWTstrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local').Strategy;
const customStrategy = require('passport-custom').Strategy;
const googleStrategy = require('passport-google-oauth2').Strategy;
const crypto = require('crypto');
const { tokenType, accountState } = require('../_helpers/enum');
const authService = require('./auth.service');
const userService = require('../users/users.service');
const { UnauthorizedError } = require('express-jwt');
const memCache = require('./../cache').default;

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

//twitter oauth 2.0
//https://developer.twitter.com/en/docs/authentication/oauth-2-0/user-access-token
passport.use(
    'twitterLogin',
    new customStrategy(async (req, done) => {
        const callbackURL = '/twitter/callback';
        const oauth_authorize_url = 'https://twitter.com/i/oauth2/authorize';
        const oauth_token_url = 'https://api.twitter.com/2/oauth2/token';
        const user_profile_url =
            'https://api.twitter.com/2/users/me?user.fields=profile_image_url';
        //handler handles both performing the initial request for the request token
        //and the received request to the callback url and performing the subsequent authentication request
        if (req.path !== callbackURL) {
            //initial request -  Step 1: GET oauth2/authorize
            const code_verifier = crypto.randomBytes(48).toString('hex');
            const code_challenge = code_verifier.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
            const state = crypto.randomBytes(128).toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
            if (memCache.set(state, code_verifier))
                req.res.redirect(`${oauth_authorize_url}?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${process.env.TWITTER_CALLBACK}&scope=tweet.read%20users.read%20offline.access&state=${state}&code_challenge=${code_challenge}&code_challenge_method=plain`);
            else
                done(null, false, { message: 'Failed to save state. Twitter authentication failed.' })
        } else {
            //is a request to our defined callback url
            //Step 2: POST oauth2/token
            try {
                const { state, code } = req.query;
                const code_verifier = memCache.get(state);
                memCache.del(state);
                const authorizationHeader = btoa(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`);
                if (!state || !code || !code_verifier) done(null, false, { message: 'Twitter authentication failed.' });
                else {
                    const queryParams = {
                        code: code,
                        grant_type: 'authorization_code',
                        client_id: process.env.TWITTER_CLIENT_ID,
                        redirect_uri: process.env.TWITTER_CALLBACK,
                        code_verifier: code_verifier
                    }
                    const queryString = new URLSearchParams(queryParams).toString();
                    const config = {
                        headers: {
                            'Authorization': `Basic ${authorizationHeader}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                    //if this request succeeds the user is now autehtnicated
                    const res = await axios.post(`${oauth_token_url}?${queryString}`, null, config);
                    const access_token = (new URLSearchParams(res.data)).get('access_token');

                    //but we don't have access to all the date we need to create or update their profile
                    //so we also request that
                    const data = await axios({
                        method: 'GET',
                        url: user_profile_url,
                        headers: { 'Authorization': `Bearer ${access_token}` }
                    });
                    const profileData = data.data.data;
                    const twitterProfile = {
                        id: profileData.id,
                        name: profileData.name,
                        username: profileData.username
                    };
                    //create or update user with the twitter integration
                    let user = await userService.getByTwitterId(profileData.id);
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
                            null,
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
