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
const demoUploadHandler = require('../_middleware/demoUploadHandler');
const s3UploadHandler = require('../_middleware/s3UploadHandler');
const { nanoid } = require('nanoid');
const sorterSchema = require('./../../schema/sorter.schema').sorterFormSchema;
const mimeTypeRegex = /image\/(p?jpeg|(x-)?png)/;

const uploadHandler = process.env.UPLOAD_TYPE === 'LOCAL' ? demoUploadHandler : s3UploadHandler;

// routes
router.post('/', getPublic);
//router.get('/all', getAll); // sorters list
router.post('/checkNew', checkForUpdates);
router.post('/getUpdate', updatePublic);
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
        mimeTypeRegex
    }),
    uploadHandler(
        [
            { objectPath: ['picture'], uploadPath: 'sorter-banners/' },
            { objectPath: ['items', 'picture'], uploadPath: 'sorter-images/' }
        ],
        mimeTypeRegex
    ),
    schemaValidator(sorterSchema),
    createSorter
); // create a new sorter
router.post('/viewCount', incrementViewCount);
router.post('/getVersion/:id', extractUser(), getSorterVersion);
router.post('/:id', extractUser(), getById); // view a sorter

module.exports = router;

function getAll(req, res, next) {}

function checkForUpdates(req, res, next) {
    sorterService
        .checkNew(req.body.lastUpdated)
        .then((count) => res.json(count))
        .catch((err) => next(err));
}

function updatePublic(req, res, next) {
    const date = new Date(req.body.lastUpdated);
    if (Number.isInteger(req.body.count) && date.valueOf()) {
        sorterService
            .getSorterList(
                { $and: [{ 'meta.status': sorterStatus.PUBLIC }, { 'meta.updated_date': { $gte: date } }] },
                null,
                req.body.count
            )
            .then((sorters) => res.json(sorters))
            .catch((err) => next(err));
    } else return res.status(400).json({ message: 'Bad Request' });
}

function getPublic(req, res, next) {
    const date = new Date(req.body.lastUpdated);
    if (Number.isInteger(req.body.count) && date.valueOf()) {
        sorterService
            .getSorterList(
                { $and: [{ 'meta.status': sorterStatus.PUBLIC }, { 'meta.created_date': { $lt: date } }] },
                req.body.count,
                null
            )
            .then((sorters) => res.json(sorters))
            .catch((err) => next(err));
    } else return res.status(400).json({ message: 'Bad Request' });
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
    const resultCount = req.body.resultCount ?? 10;
    sorterService
        .getById(id, userId, getUserInfo, versionId, resultCount)
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
        .updateSorter({ _id: req.body.id }, { $inc: { 'meta.views': 1 } }, false)
        .then(() => res.sendStatus(200))
        .catch((err) => next(err));
}

function mapSorterRequest(sorterObj, user) {
    const currentDate = new Date();
    return {
        _id: nanoid(11),
        meta: {
            created_by: user.id,
            created_date: currentDate,
            updated_date: currentDate,
            status: sorterObj.privacy ? sorterStatus.PRIVATE : sorterStatus.PUBLIC,
            views: 0,
            favorites: 0
        },
        data: [
            {
                version_id: nanoid(11),
                created_date: currentDate,
                name: sorterObj.name,
                picture: sorterObj.picture ?? '',
                description: sorterObj.description,
                tags: sorterObj.tags ?? [],
                groups: sorterObj.groups ?? [],
                items: sorterObj.items
            }
        ]
    };
}
