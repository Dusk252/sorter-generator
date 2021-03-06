const express = require('express');
const passport = require('passport');
const router = express.Router();
const userService = require('./users.service');
const authorize = require('../_middleware/authorize');
const Roles = require('../_helpers/enum').role;
const { base_info, extended_info } = require('./users.entity');

// routes
router.post('/', /*passport.authenticate('jwt', { session: false }), authorize(Roles.ADMIN),*/ getUserList); // admin only
///router.get('/self', passport.authenticate('jwt', { session: false }), getSelf); // all authenticated users
router.get('/:id', passport.authenticate('jwt', { session: false }), getById); // all authenticated users
router.post('/addFavorite', passport.authenticate('jwt', { session: false }), addFavorite);
router.post('/removeFavorite', passport.authenticate('jwt', { session: false }), removeFavorite);
module.exports = router;

function getUserList(req, res, next) {
    if (Number.isInteger(req.body.page)) {
        userService
            .getUserList(req.body.page)
            .then((users) => res.json(users))
            .catch((err) => next(err));
    }
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = req.params.id;
    // only allow admins to access other user details
    if (currentUser.role === Roles.ADMIN || currentUser.id === id) {
        userService
            .getById(id, extended_info)
            .then((user) => (user ? res.json(user) : res.sendStatus(404)))
            .catch((err) => next(err));
    } else {
        userService
            .getById(id, base_info)
            .then((user) => (user ? res.json(user) : res.sendStatus(404)))
            .catch((err) => next(err));
    }
}

function addFavorite(req, res, next) {
    const currentUser = req.user;
    const sorterId = req.body.sorter_id;
    if (sorterId && sorterId.length) {
        userService
            .updateUser({ _id: currentUser.id }, { $addToSet: { favorite_sorters: sorterId } })
            .then(() => res.sendStatus(200))
            .catch((err) => next(err));
    } else res.sendStatus(400);
}

function removeFavorite(req, res, next) {
    const currentUser = req.user;
    const sorterId = req.body.sorter_id;
    if (sorterId && sorterId.length) {
        userService
            .updateUser({ _id: currentUser.id }, { $pull: { favorite_sorters: sorterId } })
            .then(() => res.sendStatus(200))
            .catch((err) => next(err));
    } else res.sendStatus(400);
}
