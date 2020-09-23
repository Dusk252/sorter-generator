const express = require('express');
const passport = require('passport');
const router = express.Router();
const userService = require('./users.service');
const authorize = require('../authentication/authorize');
const Roles = require('../_helpers/enum').role;

// routes
router.get('/', passport.authenticate('jwt', { session: false }), authorize(Roles.ADMIN), getAll); // admin only
router.get('/self', passport.authenticate('jwt', { session: false }), getSelf); // all authenticated users
router.get('/:id', passport.authenticate('jwt', { session: false }), authorize(Roles.ADMIN), getById); // admin only
module.exports = router;

function getAll(req, res, next) {
    userService
        .getAll()
        .then((users) => res.json(users))
        .catch((err) => next(err));
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
    if (currentUser.role !== Roles.ADMIN) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService
        .getById(req.params.id)
        .then((user) => (user ? res.json(user) : res.sendStatus(404)))
        .catch((err) => next(err));
}
