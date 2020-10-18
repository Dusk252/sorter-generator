const config = require('./../config.json');
const db = require('./../db');
const ObjectID = require('mongodb').ObjectID;

const pageSize = 10;

module.exports = {
    getSorterList,
    getById,
    insertSorter
    //insertImage
};

async function getSorterList(query, page) {
    return await db
        .get()
        .collection('sorters')
        .aggregate([
            { $match: query },
            { $sort: { _id: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            { $project: { basic_info: 1 } }
        ])
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
        .then((result) => {
            sorter._id = result.insertedId;
            return sorter;
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
