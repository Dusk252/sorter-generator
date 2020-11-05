const express = require('express');
const router = express.Router();
const sorterResultsService = require('./sorterResults.service');
const authorize = require('../_middleware/authorize');
const extractUser = require('../_middleware/extractUser');
const schemaValidator = require('../_middleware/schemaValidator');
const sorterResultsSchema = require('./../../schema/sorterResults.schema').sorterResultsSchema;
const ObjectID = require('mongodb').ObjectID;

// routes
router.post('/new', extractUser(), schemaValidator(sorterResultsSchema), createNewResultEntry); // insert new result
router.get('/count/:id', getResultCount);
router.get('/:id', extractUser(), getById); // view a result
//TODO: get by userId and get by sorterId
//TODO: schema validation for results object

module.exports = router;

function getById(req, res, next) {
    const resultId = req.params.id;
    const userId = req.user ? req.user.id : null;
    sorterResultsService
        .getById(resultId, userId)
        .then((results) => (results ? res.json(results) : res.sendStatus(404)))
        .catch((err) => next(err));
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
        sorter_id: new ObjectID(resObj.sorter_id),
        user_id: new ObjectID(user.id),
        created_date: new Date(),
        sorter_version_id: new ObjectID(resObj.sorter_version_id),
        results: resObj.results,
        ties: resObj.ties
    };
}
