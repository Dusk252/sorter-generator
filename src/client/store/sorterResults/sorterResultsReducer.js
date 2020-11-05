import { MESSAGES } from './sorterResultsActions';

export const initialState = {
    resultsList: {}
};

const sorterResultsReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case MESSAGES.NEW_SORTER_RESULT_RESOLVE:
            return { ...state, resultsList: Object.assign({}, state.resultsList, { [payload._id]: payload }) };
        case MESSAGES.GET_SORTER_RESULT_RESOLVE:
            return { ...state, resultsList: Object.assign({}, state.resultsList, { [payload._id]: payload }) };
        default:
            return state;
    }
};

export default sorterResultsReducer;
