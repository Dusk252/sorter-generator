const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;
const { secret } = require('../config.json');
const userService = require('../users/users.service');

passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    userService.authenticate(email, password)
        .then(user => {
            if (user)
                return done(null, user, { message: 'Login successful.' });
            else
                return done(null, false, { message: 'Username or password is incorrect.' })
        })
        .catch(err => done(err));
}));

passport.use(new JWTstrategy({
    //secret we used to sign our JWT
    secretOrKey: secret,
    //we expect the user to send the token as a query parameter with the name 'secret_token'
    jwtFromRequest: extractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
    try {
        //Pass the user details to the next middleware
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));