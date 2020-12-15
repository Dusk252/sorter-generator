import keyMirror from 'keymirror';

export const SIGNALS = keyMirror({
    GET_USER_START: null,
    GET_SELF_START: null,
    TOGGLE_FAVORITE: null
});

export const MESSAGES = keyMirror({
    GET_USER_RESOLVE: null,
    GET_USER_REJECT: null,
    GET_SELF_RESOLVE: null,
    GET_SELF_REJECT: null,
    POPULATE_USERS_STATE: null,
    TOGGLE_FAVORITE_RESOLVE: null,
    TOGGLE_FAVORITE_REJECT: null
});

export const getUser = (id) => ({ type: SIGNALS.GET_USER_START, id });
export const getSelf = () => ({ type: SIGNALS.GET_SELF_START });
export const toggleFavorite = (id) => ({ type: SIGNALS.TOGGLE_FAVORITE, id });

export const resolveGetUser = (user) => ({ type: MESSAGES.GET_USER_RESOLVE, payload: user });
export const rejectGetUser = () => ({ type: MESSAGES.GET_USER_REJECT });
export const resolveGetSelf = (user) => ({ type: MESSAGES.GET_USER_RESOLVE, payload: user });
export const rejectGetSelf = () => ({ type: MESSAGES.GET_USER_REJECT });
export const resolveToggleFavorite = (id, isAdd) => ({ type: MESSAGES.TOGGLE_FAVORITE_RESOLVE, payload: { id, isAdd } });
export const rejectToggleFavorite = () => ({ type: MESSAGES.TOGGLE_FAVORITE_REJECT });
