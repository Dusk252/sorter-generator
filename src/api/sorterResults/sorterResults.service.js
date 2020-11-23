const config = require('./../config.json');
const db = require('./../db');

const pageSize = 10;

module.exports = {
    getById,
    getResultsList,
    getResultCount,
    insertResults
};

async function getById(id, userId) {
    return await db.get().collection('sorter_results').findOne({
        _id: id
    });
}

async function checkNew(query, lastUpdated) {
    return await db
        .get()
        .collection('sorters')
        .count({ $and: [query, { created_date: { $gte: new Date(lastUpdated) } }] });
}

async function getResultsList(query, count) {
    return await db
        .get()
        .collection('sorter_results')
        .aggregate([
            { $match: query },
            { $sort: { created_date: -1 } },
            { $skip: count ?? 0 },
            { $limit: count != null ? pageSize : Number.MAX_SAFE_INTEGER },
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
                    created_date: 1,
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
