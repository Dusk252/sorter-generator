import { MESSAGES } from './authActions';
import { MESSAGES as SORTER_RESULT_MESSAGES } from './../sorterResults/sorterResultsActions';
import { MESSAGES as USER_MESSAGES } from './../users/usersActions';

const sorter_history_len = 12;

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
                const sorterHistory =
                    state.currentUser.sorter_history.length < sorter_history_len
                        ? [...state.currentUser.sorter_history]
                        : state.currentUser.sorter_history.slice(0, -1);
                sorterHistory.unshift({ _id: payload._id });
                return { ...state, currentUser: { ...state.currentUser, sorter_history: sorterHistory } };
            }
        case USER_MESSAGES.TOGGLE_FAVORITE_RESOLVE:
            const favorites = state.currentUser.favorite_sorters.slice(0, state.currentUser.favorite_sorters.length);
            if (payload.isAdd)
                return { ...state, currentUser: { ...state.currentUser, favorite_sorters: [...favorites, payload.id] } };
            else {
                const index = state.currentUser.favorite_sorters.indexOf(payload.id);
                if (index === -1) return state;
                else {
                    favorites.splice(index, 1);
                    return { ...state, currentUser: { ...state.currentUser, favorite_sorters: favorites } };
                }
            }
        default:
            return state;
    }
};

export default authReducer;
