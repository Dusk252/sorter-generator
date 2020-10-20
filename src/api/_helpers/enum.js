const keyMirror = require('keyMirror');

const role = keyMirror({
    ADMIN: null,
    USER: null
});

const tokenType = keyMirror({
    ACCESS_TOKEN: null,
    REFRESH_TOKEN: null
});

const accountState = keyMirror({
    ACTIVE: null,
    PENDING: null,
    SUSPENDED: null,
    DELETED: null
});

const sorterStatus = keyMirror({
    PUBLIC: null,
    UNLISTED: null,
    PRIVATE: null
});

module.exports = {
    role,
    tokenType,
    accountState,
    sorterStatus
};
