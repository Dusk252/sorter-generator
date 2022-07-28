import keyMirror from 'keymirror';

export const SIGNALS = keyMirror({
    GET_NEW_TOKEN: null,
    LOCAL_LOGIN: null,
    LOGOUT: null
});

export const MESSAGES = keyMirror({
    AUTH_REQUESTED: null,
    AUTH_RESOLVED: null,
    AUTH_REJECTED: null,
    GET_NEW_TOKEN_RESOLVED: null,
    CLEAR_AUTH_ERROR: null,
    CLEAR_USER: null
});

export const getNewToken = (redirect) => ({ type: SIGNALS.GET_NEW_TOKEN, redirect });
export const localLogin = (email, password) => ({ type: SIGNALS.LOCAL_LOGIN, email, password });
export const logout = () => ({ type: SIGNALS.LOGOUT });

export const requestAuth = () => ({ type: MESSAGES.AUTH_REQUESTED });
export const resolveAuth = () => ({ type: MESSAGES.AUTH_RESOLVED });
export const rejectAuth = (authError = true) => ({ type: MESSAGES.AUTH_REJECTED, payload: authError });
export const resolveGetNewToken = (data) => ({ type: MESSAGES.GET_NEW_TOKEN_RESOLVED, payload: data });
export const clearAuthError = () => ({ type: MESSAGES.CLEAR_AUTH_ERROR });
export const clearUser = () => ({ type: MESSAGES.CLEAR_USER });
