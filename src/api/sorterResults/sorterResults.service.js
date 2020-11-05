const config = require('./../config.json');
const db = require('./../db');
const ObjectID = require('mongodb').ObjectID;

module.exports = {
    getById,
    getSorterResultCount,
    insertResults
};

async function getById(id, userId) {
    return await db
        .get()
        .collection('sorter_results')
        .findOne({
            _id: new ObjectID(id)
        });
}

async function getSorterResultCount(sorterId) {
    return await db
        .get()
        .collection('sorter_results')
        .count({
            sorter_id: new ObjectID(sorterId)
        });
}

async function insertResults(sorterResult) {
    return await db
        .get()
        .collection('sorter_results')
        .insertOne(sorterResult)
        .then((result) => {
            sorterResult._id = result.insertedId;
            return sorterResult;
        })
        .catch(() => {
            return false;
        });
}
