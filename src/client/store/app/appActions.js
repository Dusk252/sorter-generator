const keyMirror = require('keyMirror');

export const SIGNALS = keyMirror({
    CHANGE_ROUTE: null,
    INITIAL_LOAD: null
});

export const MESSAGES = keyMirror({
    REQUEST_START: null,
    REQUEST_END: null,
    SET_FIRST_RENDER: null,
    LOCATION_CHANGE: null
});

export const startRequest = () => ({ type: MESSAGES.REQUEST_START });
export const endRequest = () => ({ type: MESSAGES.REQUEST_END });
export const changeRoute = (path) => ({ type: SIGNALS.CHANGE_ROUTE, path });
export const initialLogin = (path) => ({ type: SIGNALS.INITIAL_LOAD, path });
export const setFirstRender = (isFirstRender) => ({ type: MESSAGES.SET_FIRST_RENDER, payload: isFirstRender });
export const locationChange = (newLocation) => ({
    type: MESSAGES.LOCATION_CHANGE,
    payload: { newLocation }
});
