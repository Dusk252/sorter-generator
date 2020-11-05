const config = require('./../config.json');
const db = require('./../db');
const ObjectID = require('mongodb').ObjectID;
const sorterStatus = require('./../_helpers/enum').sorterStatus;

const pageSize = 10;

module.exports = {
    getSorterList,
    getById,
    insertSorter,
    updateSorter,
    getSorterVersion
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
                    localField: 'meta.created_by',
                    foreignField: '_id',
                    as: 'user_info_array'
                }
            },
            {
                $lookup: {
                    from: 'sorter_results',
                    localField: '_id',
                    foreignField: 'sorter_id',
                    as: 'sorter_results'
                }
            },
            {
                $addFields: {
                    'meta.times_taken': { $size: '$sorter_results' }
                }
            },
            {
                $project: {
                    meta: 1,
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
                    },
                    info: [
                        {
                            version_id: { $arrayElemAt: ['$data.version_id', 0] },
                            name: { $arrayElemAt: ['$data.name', 0] },
                            picture: { $arrayElemAt: ['$data.picture', 0] },
                            description: { $arrayElemAt: ['$data.description', 0] },
                            tags: { $arrayElemAt: ['$data.tags', 0] }
                        }
                    ]
                }
            }
        ])
        .toArray();
}

async function getById(id, userId, getUserInfo = false, versionId = null) {
    const infoQuery =
        versionId != null
            ? {
                  $concatArrays: [
                      { $ifNull: [{ $slice: ['$data', 1] }, []] },
                      {
                          $ifNull: [
                              {
                                  $slice: [
                                      {
                                          $filter: {
                                              input: '$data',
                                              as: 'item',
                                              cond: {
                                                  $eq: ['$$item.version_id', new ObjectID(versionId)]
                                              }
                                          }
                                      },
                                      1
                                  ]
                              },
                              []
                          ]
                      }
                  ]
              }
            : { $slice: ['$data', 1] };
    if (getUserInfo) {
        const resList = await db
            .get()
            .collection('sorters')
            .aggregate([
                {
                    $match: {
                        _id: new ObjectID(id),
                        $or: [{ 'meta.status': sorterStatus.PUBLIC }, { 'meta.created_by': new ObjectID(userId) }]
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'meta.created_by',
                        foreignField: '_id',
                        as: 'user_info_array'
                    }
                },
                {
                    $project: {
                        meta: 1,
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
                        },
                        info: infoQuery
                    }
                }
            ])
            .toArray();
        if (resList.length > 0) return resList[0];
    } else {
        return await db
            .get()
            .collection('sorters')
            .findOne(
                {
                    _id: new ObjectID(id),
                    $or: [{ 'meta.status': sorterStatus.PUBLIC }, { 'meta.created_by': new ObjectID(userId) }]
                },
                {
                    fields: { meta: 1, info: infoQuery }
                }
            );
    }
}

async function getSorterVersion(id, userId, versionId) {
    return await db
        .get()
        .collection('sorters')
        .findOne(
            {
                _id: new ObjectID(id),
                $or: [{ 'meta.status': sorterStatus.PUBLIC }, { 'meta.created_by': new ObjectID(userId) }]
            },
            { fields: { data: { $elemMatch: { version_id: new ObjectID(versionId) } } } }
        );
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

async function updateSorter(findQuery, updateQuery, returnUpdated = false) {
    if (returnUpdated) {
        const res = await db
            .get()
            .collection('sorters')
            .findOneAndUpdate(findQuery, updateQuery, { returnNewDocument: true });
        return res.ok === 1 ? res.value : null;
    } else db.get().collection('sorters').updateOne(findQuery, updateQuery);
}

// async function insertImage(url, deletehash) {
//     return await db
//         .get()
//         .collection('images')
//         .insertOne({ url, deletehash })
//         .then(() => true)
//         .catch(() => false);
// }
