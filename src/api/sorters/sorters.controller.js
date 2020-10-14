const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');
const sorterService = require('./sorters.service');
const authorize = require('./../auth/authorize');
const Roles = require('./../_helpers/enum').roles;
const SorterStatus = require('./sorters.status');
const validateSorterSubmission = require('./../../schema/sorter.schema').validateData;
const sorterSchema = require('./../../schema/sorter.schema').sorterFormSchema;
const imgurClientKey = require('./../config.json').imgur.oauth_key;

// routes
router.get('/', getPublic);
router.get('/all', getAll); // sorters list
router.get('/:status', getByStatus); // get public, awaiting approval, private, etc
router.get('/mySorters', getUserCreated); // sorters created by specific user
router.get('/:id', getById); // view a sorter
router.post('/create', passport.authenticate('jwt', { session: false }), createSorter); // create a new sorter
module.exports = router;

function getAll(req, res, next) {
    sorterService
        .getAll({}, 0, 10)
        .then((sorters) => res.json(sorters))
        .catch((err) => next(err));
}

function getPublic(req, res, next) {
    sorterService
        .getAll({ status: SorterStatus.PUBLIC }, 0, 10)
        .then((sorters) => res.json(sorters))
        .catch((err) => next(err));
}

function getByStatus(req, res, next) {
    const currentUser = req.user;

    // if status is not valid
    if (!Object.values(sorterStatus).includes(req.param.status))
        return res.status(404).json({ message: 'Requested invalid sorter status' });

    // only allow admins to access types other than public
    if (req.params.status != SorterStatus.PUBLIC && currentUser.role !== Roles.Admin)
        return res.status(401).json({ message: 'Unauthorized' });

    sorterService
        .getAll({ status: req.params.status }, 0, 10)
        .then((sorters) => res.json(sorters))
        .catch((err) => next(err));
}

function getUserCreated(req, res, next) {}

function getById(req, res, next) {
    const id = parseInt(req.params.id);

    sorterService
        .getById(req.params.id, req.user.id)
        .then((sorter) => (sorter ? res.json(sorter) : res.sendStatus(404)))
        .catch((err) => next(err));
}

function createSorter(req, res, next) {
    const sorter = req.body.sorter;
    if (!req.user) res.status(401).json({ message: 'Unauthorized' });
    else if (validateSorterSubmission(sorter, sorterSchema).errors)
        res.status(400).json({ message: 'Invalid sorter object' });
    else res.status(200).json({ sorter });
    // sorterService
    //     .insertSorter(sorter)
    //     .then()
    //     .catch((err) => next(err));
}

// const formUrlEncoded = (x) => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

// async function storeImg(req, res, next) {
//     const image = req.files.picture;
//     try {
//         const response = await axios.post(
//             'https://api.imgur.com/3/upload',
//             formUrlEncoded({
//                 image: image.data.toString('base64'),
//                 type: 'base64'
//             }).substring(1),
//             {
//                 headers: {
//                     Authorization: `Client-ID ${imgurClientKey}`,
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 }
//             }
//         );
//         const url = response.data.data.link;
//         const deleteHash = response.data.data.deletehash;
//         sorterService.insertImage(url, deleteHash);
//         res.status(200).json({ url, deleteHash });
//     } catch (err) {
//         next(err);
//     }
// }
