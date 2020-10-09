const keyMirror = require('keyMirror');

export const SIGNALS = keyMirror({
    GET_NEW_TOKEN: null,
    LOCAL_LOGIN: null
});

export const MESSAGES = keyMirror({
    AUTH_REQUESTED: null,
    AUTH_RESOLVED: null,
    AUTH_REJECTED: null,
    GET_NEW_TOKEN_RESOLVED: null
});

export const getNewToken = (callback) => ({ type: SIGNALS.GET_NEW_TOKEN, callback });
export const localLogin = (email, password, callback) => ({ type: SIGNALS.LOCAL_LOGIN, email, password, callback });

export const requestAuth = () => ({ type: MESSAGES.AUTH_REQUESTED });
export const resolveAuth = () => ({ type: MESSAGES.AUTH_RESOLVED });
export const rejectAuth = () => ({ type: MESSAGES.AUTH_REJECTED });
export const resolveGetNewToken = (data) => ({ type: MESSAGES.GET_NEW_TOKEN_RESOLVED, payload: data });
