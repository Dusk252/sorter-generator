const Roles = require('../_helpers/enum').role;
const db = require('./../db');
const bycrpt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;

const saltRounds = 10;

module.exports = {
    getAll,
    getById,
    getByEmail,
    createUser,
    updateUser
};

async function getAll() {
    let users = await db.get().collection('users').find().toArray();
    users.map((u) => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
    return users;
}

async function getById(id) {
    const user = await db
        .get()
        .collection('users')
        .findOne({ _id: new ObjectID(id) });
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

async function getByEmail(email) {
    const users = await db
        .get()
        .collection('users')
        .find({
            email: { $regex: new RegExp(email, 'i') }
        })
        .toArray();
    if (users.length >= 1) {
        const user = users[0];
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}

async function createUser(username, email, password, icon, account_status, integration) {
    let user = {
        joined_date: new Date(),
        friends: [],
        favorite_sorters: [],
        sorter_history: [],
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
        integration3rdparty: Array.isArray(integration) ? integration : [],
        role: Roles.User,
        account_status: account_status
    };
    const { insertedId } = await db.get().collection('users').insertOne(user);
    user._id = insertedId;
    return user;
}

async function updateUser(userId, updateQuery, returnUpdated = false) {
    if (returnUpdated) {
        const res = await db
            .get()
            .collection('users')
            .findOneAndUpdate({ _id: userId }, updateQuery, { returnNewDocument: true });
        return res.ok === 1 ? res.value : null;
    } else db.get().collection('users').updateOne({ _id: userId }, updateQuery);
}
