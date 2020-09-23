const Roles = require('../_helpers/enum').role;
const db = require('./../db');
const bycrpt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;

const saltRounds = 10;

module.exports = {
    getAll,
    getById,
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

async function getUserByEmail(email) {
    const users = await db
        .get()
        .collection('users')
        .find({
            email: email
        })
        .toArray();
    if (users.length >= 1) {
        const user = users[0];
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}

async function createUser(username, email, password, icon, account_status) {
    db.get()
        .collection('users')
        .insertOne({
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
            integration3rdparty: [],
            role: Roles.User,
            account_status: account_status
        });
}

async function updateUser(userId, updateQuery) {
    db.get().collection('users').updateOne({ _id: userId }, { $set: updateQuery });
}
