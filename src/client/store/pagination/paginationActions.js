import keyMirror from 'keymirror';

export const pageTypes = {
    users: {
        name: 'users',
        isPrivate: true
    },
    sorters: {
        name: 'sorters',
        isPrivate: false
    },
    sorter_results: {
        name: 'sorter_results',
        isPrivate: true
    }
};

export const SIGNALS = keyMirror({
    GET_PAGE: null,
    //CHECK_NEW: null,
    GET_NEW: null
});

export const MESSAGES = keyMirror({
    REQUEST_STARTED: null,
    REQUEST_RESOLVED: null,
    REQUEST_REJECTED: null,
    //REQUEST_CHECK_NEW_RESOLVED: null,
    REQUEST_NEW_RESOLVED: null,
    REQUEST_UPDATED_RESOLVED: null,
    RESET_HASMORE_CHECK: null
});

const genStateMessage = (name) => `POPULATE_${name.toUpperCase()}_STATE`;

export const getPage = (itemCount, lastUpdated, pageType) => ({
    type: SIGNALS.GET_PAGE,
    name: pageType.name,
    count: itemCount,
    lastUpdated: lastUpdated,
    isPrivate: pageType.isPrivate
});
// export const checkNewItems = (lastUpdated, pageType) => ({
//     type: SIGNALS.CHECK_NEW,
//     name: pageType.name,
//     lastUpdated: lastUpdated,
//     isPrivate: pageType.isPrivate
// });
export const getNewItems = (lastUpdated, pageType) => ({
    type: SIGNALS.GET_NEW,
    name: pageType.name,
    lastUpdated: lastUpdated,
    isPrivate: pageType.isPrivate
});

export const startPageRequest = () => ({ type: MESSAGES.REQUEST_STARTED });
export const resolvePageRequest = ({ name, payload }) => ({ type: MESSAGES.REQUEST_RESOLVED, name, payload });
export const rejectPageRequest = (payload) => ({ type: MESSAGES.REQUEST_REJECTED, payload });

//export const resolveCheckNewRequest = ({ name, payload }) => ({ type: MESSAGES.REQUEST_CHECK_NEW_RESOLVED, name, payload });
export const resolveGetNewItems = ({ name, payload }) => ({ type: MESSAGES.REQUEST_NEW_RESOLVED, name, payload });

export const resetHasMoreCheck = (name) => ({ type: MESSAGES.RESET_HASMORE_CHECK, name });
export const populateState = ({ name, payload }) => ({ type: genStateMessage(name), payload });
