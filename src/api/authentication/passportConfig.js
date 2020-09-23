const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local').Strategy;
const { tokenType } = require('../_helpers/enum');
const { authentication_token_secret } = require('../config.json');
const tokenUtil = require('./tokenUtil');
const authService = require('../authentication/authentication.service');
const { UnauthorizedError } = require('express-jwt');

//token auth
passport.use(
    'jwt',
    new JWTstrategy(
        {
            //secret we used to sign our JWT
            secretOrKey: authentication_token_secret,
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
        (email, password, done) => {
            authService
                .authenticate(email, password)
                .then((user) => {
                    if (user) {
                        return done(null, user, { message: 'Login successful.' });
                    } else return done(null, false, { message: 'Username or password is incorrect.' });
                })
                .catch((err) => done(err));
        }
    )
);
