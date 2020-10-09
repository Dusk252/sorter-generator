const keyMirror = require('keyMirror');

const pageTypes = keyMirror({
    users: null,
    sorters: null
});

export const SIGNALS = keyMirror({
    GET_PAGE: null
});

export const MESSAGES = keyMirror({
    REQUEST_STARTED: null,
    REQUEST_RESOLVED: null,
    REQUEST_REJECTED: null,
    RESET_HASMORE_CHECK: null,
    POPULATE_USERS_STATE: null,
    POPULATE_SORTER_STATE: null
});

const genStateMessage = (name) => `POPULATE_${name.toUpperCase()}_STATE`;

export const getUsersPage = (pageNumber) => ({
    type: SIGNALS.GET_PAGE,
    name: pageTypes.users,
    page: pageNumber,
    isPrivate: false
});
export const getSortersPage = (pageNumber) => ({
    type: SIGNALS.GET_PAGE,
    name: pageTypes.sorters,
    page: pageNumber,
    isPrivate: false
});

export const startRequest = () => ({ type: MESSAGES.REQUEST_STARTED });
export const resolveRequest = ({ name, meta, payload }) => ({ type: MESSAGES.REQUEST_RESOLVED, name, meta, payload });
export const rejectRequest = (payload) => ({ type: MESSAGES.REQUEST_REJECTED, payload });

export const resetHasMoreCheck = (name) => ({ type: MESSAGES.RESET_HASMORE_CHECK, name: 'users' });
export const populateState = ({ name, payload }) => ({ type: MESSAGES[genStateMessage(name)], payload });
