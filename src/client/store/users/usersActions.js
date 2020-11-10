const keyMirror = require('keyMirror');

export const SIGNALS = keyMirror({
    GET_USER_START: null,
    GET_SELF_START: null
});

export const MESSAGES = keyMirror({
    GET_USER_RESOLVE: null,
    GET_USER_REJECT: null,
    GET_SELF_RESOLVE: null,
    GET_SELF_REJECT: null,
    POPULATE_USERS_STATE: null
});

export const resolveGetUser = (user) => ({ type: MESSAGES.GET_USER_RESOLVE, payload: user });
export const rejectGetUser = () => ({ type: MESSAGES.GET_USER_REJECT });
export const resolveGetSelf = (user) => ({ type: MESSAGES.GET_USER_RESOLVE, payload: user });
export const rejectGetSelf = () => ({ type: MESSAGES.GET_USER_REJECT });
