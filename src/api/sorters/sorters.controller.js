const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');
const sorterService = require('./sorters.service');
const authorize = require('../_middleware/authorize');
const Roles = require('./../_helpers/enum').roles;
const SorterStatus = require('./sorters.status');
const schemaValidator = require('../_middleware/schemaValidator');
const fileUploadHandler = require('../_middleware/fileUploadHandler');
const sorterSchema = require('./../../schema/sorter.schema').sorterFormSchema;
const sorterPrivacy = require('../_helpers/enum').sorterPrivacy;
const imgurClientKey = require('./../config.json').imgur.oauth_key;
const ObjectID = require('mongodb').ObjectID;

// routes
router.get('/', getPublic);
router.get('/all', getAll); // sorters list
router.get('/:status', getByStatus); // get public, awaiting approval, private, etc
router.get('/mySorters', getUserCreated); // sorters created by specific user
router.get('/:id', getById); // view a sorter
router.post(
    '/create',
    passport.authenticate('jwt', { session: false }),
    fileUploadHandler({
        createParentPath: true,
        parseNested: true,
        abortOnLimit: true,
        limits: { fileSize: 3 * 1024 * 1024 },
        mimeTypeRegex: /image\/(p?jpeg|(x-)?png)/,
        uploadPath: '/data/uploads/'
    }),
    schemaValidator(sorterSchema),
    createSorter
); // create a new sorter
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
    if (!req.user) res.status(401).json({ message: 'Unauthorized' });
    const sorter = mapSorterRequest(req.body, req.user);

    sorterService
        .insertSorter(sorter)
        .then((insertedSorter) => res.json(insertedSorter))
        .catch((err) => next(err));
}

function mapSorterRequest(sorterObj, user) {
    return {
        basic_info: {
            name: sorterObj.name,
            created_by: new ObjectID(user.id),
            created_date: new Date(),
            privacy: sorterObj.privacy ? sorterPrivacy.PRIVATE : sorterPrivacy.PUBLIC,
            favorites: 0,
            total_plays: 0,
            tags: sorterObj.tags ?? []
        },
        extended_info: {
            groups: sorterObj.groups ?? [],
            characters: sorterObj.characters
        }
    };
}

//const formUrlEncoded = (x) => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '');

// async function storeImg(image) {
//     const response = await axios.post(
//         'https://api.imgur.com/3/upload',
//         formUrlEncoded({
//             image: image.data.toString('base64'),
//             type: 'base64'
//         }).substring(1),
//         {
//             headers: {
//                 Authorization: `Client-ID ${imgurClientKey}`,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         }
//     );
//     const url = response.data.data.link;
//     const deleteHash = response.data.data.deletehash;
//     sorterService.insertImage(url, deleteHash);
//     return url;
// }
