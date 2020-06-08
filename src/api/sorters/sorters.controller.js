const express = require('express');
const router = express.Router();
const sorterService = require('./sorters.service');
const authorize = require('./../_helpers/authorize')
const Roles = require('./../_helpers/enum').roles;
const SorterStatus = require('./sorters.status');

// routes
router.get('/', getPublic)
router.get('/all', getAll); // sorters list
router.get('/:status', getByStatus); // get public, awaiting approval, private, etc
router.get('/mySorters', getUserCreated); // sorters created by specific user
router.get('/:id', getById); // view a sorter
router.post('/create', createSorter); // create a new sorter
module.exports = router;

function getAll(req, res, next) {
    sorterService.getAll({}, 0, 10)
        .then(sorters => res.json(sorters))
        .catch(err => next(err));
}

function getPublic(req, res, next) {
    sorterServer.getAll({ status: SorterStatus.PUBLIC }, 0, 10)
        .then(sorters => res.json(sorters))
        .catch(err => next(err));
}

function getByStatus(req, res, next) {
    const currentUser = req.user;

    // if status is not valid
    if (!Object.values(sorterStatus).includes(req.param.status))
        return res.status(404).json({ message: 'Requested invalid sorter status' });

    // only allow admins to access types other than public
    if (req.params.status != SorterStatus.PUBLIC && currentUser.role !== Roles.Admin)
        return res.status(401).json({ message: 'Unauthorized' });

    sorterServer.getAll({ status: req.params.status }, 0, 10)
        .then(sorters => res.json(sorters))
        .catch(err => next(err));
}

function getUserCreated(req, res, next) {

}

function getById(req, res, next) {
    const id = parseInt(req.params.id);

    sorterService.getById(req.params.id, req.user.id)
        .then(sorter => sorter ? res.json(sorter) : res.sendStatus(404))
        .catch(err => next(err));
}

function createSorter(req, res, next) {
    const sorter = req.sorter;

    // TO DO
    // do object validation here

    sorterService.insertSorter(sorter);
}