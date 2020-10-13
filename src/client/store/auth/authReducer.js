import { MESSAGES } from './authActions';

export const initialState = {
    isFetching: false,
    accessToken: null,
    currentUser: null,
    authError: false
};

const authReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case MESSAGES.AUTH_REQUESTED:
            return { ...state, isFetching: true };
        case MESSAGES.AUTH_RESOLVED:
            return { ...state, isFetching: true };
        case MESSAGES.AUTH_REJECTED:
            return { ...state, isFetching: false, authError: true };
        case MESSAGES.GET_NEW_TOKEN_RESOLVED:
            return { ...state, isFetching: false, authError: false, ...payload };
        case MESSAGES.CLEAR_AUTH_ERROR:
            return { ...state, authError: false };
        default:
            return state;
    }
};

export default authReducer;
