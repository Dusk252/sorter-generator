import keyMirror from 'keymirror';

export const role = keyMirror({
    ADMIN: null,
    USER: null
});

export const tokenType = keyMirror({
    ACCESS_TOKEN: null,
    REFRESH_TOKEN: null
});

export const accountState = keyMirror({
    ACTIVE: null,
    PENDING: null,
    SUSPENDED: null,
    DELETED: null
});

export const sorterStatus = keyMirror({
    PUBLIC: null,
    UNLISTED: null,
    PRIVATE: null
});
