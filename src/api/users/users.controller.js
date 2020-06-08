const express = require('express');
const router = express.Router();
const userService = require('./users.service');
const authorize = require('./../_helpers/authorize')
const Roles = require('../_helpers/enum').roles;
const jwt = require('jsonwebtoken');
const request = require('request');
//const bcrypt = require('bcrypt');
const config = require('./../config.json');

// routes
router.post('/login', localLogin);     // public route
router.post('/login-twitter-request', twitterLoginReq);
router.post('/login-twitter-access', twitterLoginAcc);
router.get('/', authorize(Roles.Admin), getAll); // admin only
router.get('/self', authorize(), getSelf);       // all authenticated users
router.get('/:id', authorize(Roles.Admin), getById); // admin only
module.exports = router;

function localLogin(req, res, next) {
    userService.authenticate(req.body)
        .then(user =>
            user
                ? res.json({ ...user, token: jwt.sign({ sub: user._id, role: user.role }, config.secret) })
                : res.status(400).json({ message: 'Username or password is incorrect.' }))
        .catch(err => next(err));
}

function signUp(req, res, next) {

}

function twitterLoginReq(req, res, next) {
    request.post({
        url: config.oauth_twitter_request_url,
        oauth: {
            oauth_callback: config.oauth_callback,
            consumer_key: config.oauth_twitter_key,
            consumer_secret: config.oauth_twitter_secret
        }
    }, function (err, r, body) {
        console.log(body);
        if (err)
            return res.status(500).json({ message: err.message });
        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '" }';
        res.json(JSON.parse(jsonStr));
    });
}

function twitterLoginAcc(req, res, next) {
    request.post({
        url: config.oauth_twitter_access_url,
        oauth: {
            consumer_key: config.oauth_twitter_key,
            consumer_secret: config.oauth_twitter_secret,
            token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
        if (err)
            return res.status(500).json({ message: err.message });
        if (r.statusCode != 200)
            return res.status(r.statusCode).send({ message: r.statusMessage });
        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '" }';
        res.json(JSON.parse(jsonStr));
    });
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getSelf(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only allow admins to access other user records
    if (currentUser.role !== Roles.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}