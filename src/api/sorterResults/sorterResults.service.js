const db = require('./../db');

const pageSize = 10;

module.exports = {
    getById,
    getResultsList,
    getResultCount,
    insertResults
};

async function getById(id, userId, sorterId) {
    let query = {};
    if (id) query._id = id;
    if (userId) query.user_id = userId;
    if (sorterId) query.sorter_id = sorterId;
    const resList = await db.get().collection('sorter_results').find(query).sort({ created_date: -1 }).limit(1).toArray();
    if (resList.length > 0) return resList[0];
    else return null;
}

async function checkNew(query, lastUpdated) {
    return await db
        .get()
        .collection('sorters')
        .count({ $and: [query, { created_date: { $gte: new Date(lastUpdated) } }] });
}

async function getResultsList(query, skip, limit) {
    return await db
        .get()
        .collection('sorter_results')
        .aggregate([
            { $match: query },
            { $sort: { created_date: -1 } },
            { $skip: skip ?? 0 },
            { $limit: limit != null ? limit : pageSize },
            {
                $lookup: {
                    from: 'sorters',
                    let: { sorterId: '$sorter_id', versionId: '$sorter_version_id' },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ['$_id', '$$sorterId'] } }
                        },
                        {
                            $project: {
                                sorter: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$data',
                                                as: 'item',
                                                cond: {
                                                    $eq: ['$$item.version_id', '$$versionId']
                                                }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'sorter_array'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_info_array'
                }
            },
            {
                $project: {
                    _id: 1,
                    sorter_name: { $arrayElemAt: ['$sorter_array.sorter.name', 0] },
                    sorter_img: { $arrayElemAt: ['$sorter_array.sorter.picture', 0] },
                    sorter_id: 1,
                    sorter_version_id: 1,
                    user_id: 1,
                    created_date: 1,
                    user_info: {
                        id: '$user_id',
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
                    results: 1,
                    ties: 1
                }
            }
        ])
        .toArray();
}

async function getResultCount(sorterId) {
    return await db.get().collection('sorter_results').count({
        sorter_id: sorterId
    });
}

async function insertResults(sorterResult) {
    return await db
        .get()
        .collection('sorter_results')
        .insertOne(sorterResult)
        .then(() => sorterResult)
        .catch(() => {
            return false;
        });
}
