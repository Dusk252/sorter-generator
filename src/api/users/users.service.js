const Roles = require('../_helpers/enum').role;
const db = require('./../db');
const bycrpt = require('bcrypt');
const { nanoid } = require('nanoid');

const saltRounds = 10;
const pageSize = 10;

module.exports = {
    getUserList,
    getById,
    getByEmail,
    createUser,
    updateUser
};

async function getUserList(page) {
    const users = await db
        .get()
        .collection('users')
        .aggregate([
            { $match: {} },
            { $sort: { joined_date: -1 } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
            { $project: { 'profile.username': 1, 'profile.icon': 1, role: 1 } }
        ])
        .toArray();
    return users;
}

async function getById(id, projection = {}) {
    let query = { _id: id };
    const userMatch = await db
        .get()
        .collection('users')
        .aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'sorter_results',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ['$user_id', '$$userId'] } }
                        },
                        { $sort: { created_date: -1 } },
                        { $limit: pageSize },
                        { $project: { _id: 1 } }
                    ],
                    as: 'sorter_history'
                }
            },
            {
                $project: projection
            }
        ])
        .toArray();
    if (userMatch.length > 0) return userMatch[0];
    return null;
}

async function getByEmail(email) {
    const users = await db
        .get()
        .collection('users')
        .find({
            email: { $regex: new RegExp(email, 'i') }
        })
        .toArray();
    if (users.length > 0) {
        const user = users[0];
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}

async function createUser(username, email, password, icon, account_status, integration) {
    let user = {
        _id: nanoid(11),
        joined_date: new Date(),
        friends: [],
        favorite_sorters: [],
        profile: {
            username: username,
            about_me: '',
            links_list: [],
            share_settings: {},
            icon: icon
        },
        email: email,
        password: password,
        localLogin: password && password.length,
        integration3rdparty: {}.toString.apply(integration) === '[object Object]' ? integration : {},
        role: Roles.User,
        account_status: account_status
    };
    await db.get().collection('users').insertOne(user);
    return user;
}

async function updateUser(findQuery, updateQuery, returnUpdated = false) {
    if (returnUpdated) {
        const res = await db.get().collection('users').findOneAndUpdate(findQuery, updateQuery, { returnNewDocument: true });
        return res.ok === 1 ? res.value : null;
    } else db.get().collection('users').updateOne(findQuery, updateQuery);
}
