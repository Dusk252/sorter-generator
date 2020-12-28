const db = require('./../db');
const sorterStatus = require('./../_helpers/enum').sorterStatus;

const pageSize = 10;

module.exports = {
    checkNew,
    getSorterList,
    getById,
    insertSorter,
    updateSorter,
    getSorterVersion
};

async function checkNew(lastUpdated) {
    return await db
        .get()
        .collection('sorters')
        .count({ $and: [{ 'meta.status': sorterStatus.PUBLIC }, { 'meta.created_date': { $gte: new Date(lastUpdated) } }] });
}

async function getSorterList(query, skip, limit) {
    return await db
        .get()
        .collection('sorters')
        .aggregate([
            { $match: query },
            { $sort: { 'meta.created_date': -1 } },
            { $skip: skip ?? 0 },
            { $limit: limit != null ? limit : pageSize },
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
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'favorite_sorters',
                    as: 'favoritesArray'
                }
            },
            {
                $addFields: {
                    'meta.favorites': { $size: '$favoritesArray' }
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
                                                  $eq: ['$$item.version_id', versionId]
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
                        _id: id,
                        $or: [{ 'meta.status': sorterStatus.PUBLIC }, { 'meta.created_by': userId }]
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
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'favorite_sorters',
                        as: 'favoritesArray'
                    }
                },
                {
                    $addFields: {
                        'meta.favorites': { $size: '$favoritesArray' }
                    }
                },
                {
                    $project: {
                        meta: 1,
                        favoritesCount: 1,
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
                    _id: id,
                    $or: [{ 'meta.status': sorterStatus.PUBLIC }, { 'meta.created_by': userId }]
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
                _id: id,
                $or: [{ 'meta.status': sorterStatus.PUBLIC }, { 'meta.created_by': userId }]
            },
            { fields: { data: { $elemMatch: { version_id: versionId } } } }
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
