import { MESSAGES } from './sortersActions';

export const initialState = {
    submitSorterError: false,
    sorterList: {}
};

const authReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case MESSAGES.NEW_SORTER_RESOLVE:
            return { ...state, submitSorterError: false };
        case MESSAGES.NEW_SORTER_REJECT:
            return { ...state, submitSorterError: true };
        case MESSAGES.CLEAR_SUBMISSION_ERROR:
            return { ...state, submitSorterError: false };
        default:
            return state;
    }
};

export default authReducer;
