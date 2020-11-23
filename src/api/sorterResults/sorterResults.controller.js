const express = require('express');
const router = express.Router();
const sorterResultsService = require('./sorterResults.service');
const passport = require('passport');
const authorize = require('../_middleware/authorize');
const extractUser = require('../_middleware/extractUser');
const schemaValidator = require('../_middleware/schemaValidator');
const sorterResultsSchema = require('./../../schema/sorterResults.schema').sorterResultsSchema;
const { nanoid } = require('nanoid');

// routes
router.post('/', passport.authenticate('jwt', { session: false }), getUserHistory); // get result list
router.post('/idList', getByIdList);
router.post('/checkNew', passport.authenticate('jwt', { session: false }), checkForUpdates);
router.post('/getNew', passport.authenticate('jwt', { session: false }), getNewUserHistory);
router.post('/new', extractUser(), schemaValidator(sorterResultsSchema), createNewResultEntry); // insert new result
router.get('/count/:id', getResultCount);
router.get('/:id', extractUser(), getById); // view a result
//router.get('/user/:id', getUserRecent);
//TODO: get by userId and get by sorterId
//TODO: schema validation for results object

module.exports = router;

function checkForUpdates(req, res, next) {
    const userId = req.user ? req.user.id : null;
    if (!userId) res.sendStatus(401);
    else
        sorterResultsService
            .checkNew({ user_id: userId }, req.body.lastUpdated)
            .then((count) => res.json(count))
            .catch((err) => next(err));
}

function getUserHistory(req, res, next) {
    const userId = req.user ? req.user.id : null;
    const date = new Date(req.body.lastUpdated);
    if (!userId) res.sendStatus(401);
    else if (Number.isInteger(req.body.count) && date.valueOf()) {
        sorterResultsService
            .getResultsList({ $and: [{ user_id: userId }, { created_date: { $lt: date } }] }, req.body.count)
            .then((results) => res.json(results))
            .catch((err) => next(err));
    } else return res.status(400).json({ message: 'Bad Request' });
}

function getNewUserHistory(req, res, next) {
    const userId = req.user ? req.user.id : null;
    const date = new Date(req.body.lastUpdated);
    if (!userId) res.sendStatus(401);
    else if (date.valueOf()) {
        sorterResultsService
            .getResultsList({ $and: [{ user_id: userId }, { created_date: { $gte: date } }] }, null)
            .then((results) => res.json(results))
            .catch((err) => next(err));
    } else return res.status(400).json({ message: 'Bad Request' });
}

// function getUserRecent(req, res, next) {
//     const userId = req.params.id;
//     if (Number.isInteger(userId)) {
//         sorterResultsService
//             .getResultsList({ user_id: userId }, 1)
//             .then((results) => res.json(results))
//             .catch((err) => next(err));
//     }
// }

function getById(req, res, next) {
    const resultId = req.params.id;
    const userId = req.user ? req.user.id : null;
    sorterResultsService
        .getById(resultId, userId)
        .then((results) => (results ? res.json(results) : res.sendStatus(404)))
        .catch((err) => next(err));
}

function getByIdList(req, res, next) {
    const idList = req.body.idList;
    if (Array.isArray(idList)) {
        sorterResultsService
            .getResultsList({ _id: { $in: idList.map((r) => r._id) } }, 0)
            .then((results) => (results ? res.json(results) : res.sendStatus(404)))
            .catch((err) => next(err));
    } else res.sendStatus(400).end();
}

function getResultCount(req, res, next) {
    const sorterId = req.params.id;
    sorterResultsService
        .getSorterResultCount(sorterId)
        .then((count) => (count ? res.json(count) : res.sendStatus(404)))
        .catch((err) => next(err));
}

function createNewResultEntry(req, res, next) {
    const results = mapSorterResultRequest(req.body, req.user);
    sorterResultsService
        .insertResults(results)
        .then((insertedResults) => res.json(insertedResults))
        .catch((err) => next(err));
}

function mapSorterResultRequest(resObj, user) {
    return {
        _id: nanoid(11),
        sorter_id: resObj.sorter_id,
        user_id: user != null ? user.id : null,
        created_date: new Date(),
        sorter_version_id: resObj.sorter_version_id,
        results: resObj.results,
        ties: resObj.ties
    };
}
