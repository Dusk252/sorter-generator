const config = require('./../config.json');
const jwt = require('jsonwebtoken');
const Role = require('../_helpers/role');
const db = require('./../db');
const ObjectID = require('mongodb').ObjectID;

module.exports = {
    authenticate,
    getAll,
    getById
};

async function authenticate({ username, password }) {
    const users = await db.get().collection('users').find(
        {
            'user_info.name': username,
            'user_info.password': password
        }).toArray();
    if (users.length === 1) {   
        const user = users[0].user_info;
        const token = jwt.sign({ sub: users[0]._id, role: user.role }, config.secret);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function getAll() {
    let users = await db.get().collection('users').find().toArray();
    users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
    return users;
}

async function getById(id) {
    const user = await db.get().collection('users').findOne({ _id: new ObjectID(id) });
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}