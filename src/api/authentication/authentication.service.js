const Roles = require('../_helpers/enum').roles;
const db = require('../db');

module.exports = {
    authenticate,
    deleteRefreshToken,
    updateRefreshToken,
    isValidRefreshToken
};

async function authenticate(email, password) {
    const users = await db
        .get()
        .collection('users')
        .find({
            email: email,
            password: password
        })
        .toArray();
    if (users.length >= 1) {
        const user = users[0];
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}

async function deleteRefreshToken(token) {
    await db.get().collection('refresh_tokens').remove({ refresh_token: token });
}

async function updateRefreshToken(userId, old_token, new_token) {
    if (old_token) await deleteRequestToken(old_token);
    await db.get().collection('refresh_tokens').insertOne({ userId: userId, refresh_token: new_token });
}

async function isValidRefreshToken(userId, refresh_token) {
    const userToken = await db.get().collection('refresh_tokens').findOne({ userId: userId, refresh_token: refresh_token });
    if (!userToken) return false;
    return true;
}
