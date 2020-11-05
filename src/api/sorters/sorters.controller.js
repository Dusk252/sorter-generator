const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');
const sorterService = require('./sorters.service');
const authorize = require('../_middleware/authorize');
const extractUser = require('../_middleware/extractUser');
const Roles = require('./../_helpers/enum').roles;
const sorterStatus = require('./../_helpers/enum').sorterStatus;
const schemaValidator = require('../_middleware/schemaValidator');
const fileUploadHandler = require('../_middleware/fileUploadHandler');
const sorterSchema = require('./../../schema/sorter.schema').sorterFormSchema;
const imgurClientKey = require('./../config.json').imgur.oauth_key;
const ObjectID = require('mongodb').ObjectID;

// routes
router.post('/', getPublic);
router.get('/all', getAll); // sorters list
router.get('/mySorters', getUserCreated); // sorters created by specific user
//router.get('/:status', getByStatus); // get public, awaiting approval, private, etc
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
router.post('/viewCount', incrementViewCount);
router.post('/getVersion/:id', extractUser(), getSorterVersion);
router.post('/:id', extractUser(), getById); // view a sorter

module.exports = router;

function getAll(req, res, next) {
    if (Number.isInteger(req.body.page)) {
        sorterService
            .getSorterList({}, req.body.page)
            .then((sorters) => res.json(sorters))
            .catch((err) => next(err));
    }
}

function getPublic(req, res, next) {
    if (Number.isInteger(req.body.page)) {
        sorterService
            .getSorterList({ 'meta.status': sorterStatus.PUBLIC }, req.body.page)
            .then((sorters) => res.json(sorters))
            .catch((err) => next(err));
    }
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
    const id = req.params.id;
    const getUserInfo = req.body.getUserInfo;
    const versionId = req.body.versionId;
    const userId = req.user ? req.user.id : null;
    sorterService
        .getById(id, userId, getUserInfo, versionId)
        .then((sorter) => (sorter ? res.json(sorter) : res.sendStatus(404)))
        .catch((err) => next(err));
}

function getSorterVersion(req, res, next) {
    const id = req.params.id;
    const sorterVersion = req.body.versionId;
    const userId = req.user ? req.user.id : null;
    sorterService
        .getSorterVersion(id, userId, sorterVersion)
        .then((ver) => (ver && ver.data && ver.data.length ? res.json(ver.data[0]) : res.sendStatus(404)))
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

function incrementViewCount(req, res, next) {
    sorterService
        .updateSorter({ _id: ObjectID(req.body.id) }, { $inc: { 'meta.views': 1 } }, false)
        .then(() => res.sendStatus(200))
        .catch((err) => next(err));
}

function mapSorterRequest(sorterObj, user) {
    const currentDate = new Date();
    return {
        meta: {
            created_by: new ObjectID(user.id),
            created_date: currentDate,
            updated_date: currentDate,
            status: sorterObj.privacy ? sorterStatus.PRIVATE : sorterStatus.PUBLIC,
            views: 0,
            favorites: 0
        },
        data: [
            {
                version_id: new ObjectID(),
                created_date: currentDate,
                name: sorterObj.name,
                picture: sorterObj.picture,
                description: sorterObj.description,
                tags: sorterObj.tags ?? [],
                groups: sorterObj.groups ?? [],
                characters: sorterObj.characters
            }
        ]
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
