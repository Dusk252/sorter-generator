import { MESSAGES } from './authActions';
import { MESSAGES as SORTER_RESULT_MESSAGES } from './../sorterResults/sorterResultsActions';

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
            return { ...state, isFetching: false };
        case MESSAGES.AUTH_REJECTED:
            return { ...state, isFetching: false, authError: true };
        case MESSAGES.GET_NEW_TOKEN_RESOLVED:
            return { ...state, authError: false, ...payload };
        case MESSAGES.CLEAR_AUTH_ERROR:
            return { ...state, authError: false };
        case SORTER_RESULT_MESSAGES.NEW_SORTER_RESULT_RESOLVE:
            if (state.currentUser && state.currentUser.sorter_history) {
                const sorterHistory = state.currentUser.sorter_history.slice(0, -1);
                sorterHistory.unshift({ _id: payload._id });
                return { ...state, currentUser: { sorter_history: sorterHistory, ...state.currentUser } };
            }
        default:
            return state;
    }
};

export default authReducer;
