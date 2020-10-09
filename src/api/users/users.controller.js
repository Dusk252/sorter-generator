const express = require('express');
const passport = require('passport');
const router = express.Router();
const userService = require('./users.service');
const authorize = require('../auth/authorize');
const Roles = require('../_helpers/enum').role;
const { baseInfo, extendedInfo } = require('./users.entity');

// routes
router.post('/', /*passport.authenticate('jwt', { session: false }), authorize(Roles.ADMIN),*/ getUserList); // admin only
router.get('/self', passport.authenticate('jwt', { session: false }), getSelf); // all authenticated users
router.get('/:id', passport.authenticate('jwt', { session: false }), getById); // all authenticated users
module.exports = router;

function getUserList(req, res, next) {
    if (Number.isInteger(req.body.page)) {
        userService
            .getUserList(req.body.page)
            .then((users) => res.json(users))
            .catch((err) => next(err));
    }
}

function getSelf(req, res, next) {
    userService
        .getById(req.user.id)
        .then((user) => (user ? res.json(user) : res.sendStatus(404)))
        .catch((err) => next(err));
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);
    // only allow admins to access other user records
    if (currentUser.role === Roles.ADMIN) {
        userService
            .getById(id)
            .then((user) => (user ? res.json(user) : res.sendStatus(404)))
            .catch((err) => next(err));
    } else {
        userService
            .getById(id, { projection: baseInfo })
            .then((user) => (user ? res.json(user) : res.sendStatus(404)))
            .catch((err) => next(err));
    }
}
