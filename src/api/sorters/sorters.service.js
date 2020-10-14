const config = require('./../config.json');
const db = require('./../db');
const ObjectID = require('mongodb').ObjectID;

module.exports = {
    getAll,
    getById,
    insertSorter
    //insertImage
};

async function getAll(query, skip, take) {
    return await db
        .get()
        .collection('sorters')
        .aggregate([{ $match: query }, { $skip: skip }, { $limit: take }])
        .toArray();
}

async function getById(id, userId) {
    return await db
        .get()
        .collection('sorters')
        .findOne({ _id: new ObjectID(id), $or: [{ status: 'public' }, { 'creator.id': userId }] });
}

async function insertSorter(sorter) {
    return await db
        .get()
        .collection('sorters')
        .insertOne(sorter)
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
}

// async function insertImage(url, deletehash) {
//     return await db
//         .get()
//         .collection('images')
//         .insertOne({ url, deletehash })
//         .then(() => true)
//         .catch(() => false);
// }
