const config = require('./../config.json');
const db = require('./../db');
const ObjectID = require('mongodb').ObjectID;
const sorterStatus = require('./../_helpers/enum').sorterStatus;

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
            {
                $lookup: {
                    from: 'users',
                    localField: 'base_info.created_by',
                    foreignField: '_id',
                    as: 'user_info_array'
                }
            },
            {
                $project: {
                    base_info: 1,
                    user_info: {
                        username: {
                            $arrayElemAt: ['$user_info_array.profile.username', 0]
                        },
                        icon: {
                            $arrayElemAt: ['$user_info_array.profile.icon', 0]
                        },
                        role: {
                            $arrayElemAt: ['$user_info_array.role', 0]
                        }
                    }
                }
            }
        ])
        .toArray();
}

async function getById(id, userId) {
    console.log(id, userId);
    return await db
        .get()
        .collection('sorters')
        .findOne({
            _id: new ObjectID(id),
            $or: [{ 'base_info.status': sorterStatus.PUBLIC }, { 'base_info.created_by': new ObjectID(userId) }]
        });
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
