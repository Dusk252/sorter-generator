import keyMirror from 'keymirror';

export const SIGNALS = keyMirror({
    CHANGE_ROUTE: null,
    INITIAL_LOAD: null,
    START_AUTHENTICATED_CALL: null
});

export const MESSAGES = keyMirror({
    REQUEST_START: null,
    REQUEST_END: null,
    SET_FIRST_RENDER: null,
    INITIALIZE_IDB_STORE: null,
    LOCATION_CHANGE: null,
    AUTHENTICATED_CALL_RESOLVED: null,
    AUTHENTICATED_CALL_REJECTED: null,
    CLEAR_ERROR: null
});

export const startAuthenticatedCall = (apiCall, args) => ({ type: SIGNALS.START_AUTHENTICATED_CALL, apiCall, args });
export const changeRoute = (path) => ({ type: SIGNALS.CHANGE_ROUTE, path });
export const initialLoad = (path) => ({ type: SIGNALS.INITIAL_LOAD, path });

export const resolvePrivateCall = (payload) => ({ type: MESSAGES.AUTHENTICATED_CALL_RESOLVED, payload });
export const rejectPrivateCall = (message) => ({ type: MESSAGES.AUTHENTICATED_CALL_REJECTED, payload: message });
export const startRequest = () => ({ type: MESSAGES.REQUEST_START });
export const endRequest = () => ({ type: MESSAGES.REQUEST_END });
export const setFirstRender = (isFirstRender) => ({ type: MESSAGES.SET_FIRST_RENDER, payload: isFirstRender });
export const initializeIdbStore = () => ({ type: MESSAGES.INITIALIZE_IDB_STORE });
export const locationChange = (newLocation) => ({
    type: MESSAGES.LOCATION_CHANGE,
    payload: { newLocation }
});
export const clearError = () => ({ type: MESSAGES.CLEAR_ERROR });
