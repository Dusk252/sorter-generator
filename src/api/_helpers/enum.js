const role = {
    ADMIN: 'Admin',
    USER: 'User'
};

const tokenType = {
    ACCESS_TOKEN: 'ACCESS_TOKEN',
    REFRESH_TOKEN: 'REFRESH_TOKEN'
};

const accountState = {
    ACTIVE: 'Active',
    PENDING: 'Pending',
    SUSPENDED: 'Suspended',
    DELETED: 'Deleted'
};

module.exports = {
    role,
    tokenType,
    accountState
};
