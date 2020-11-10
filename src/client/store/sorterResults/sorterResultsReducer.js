import { MESSAGES } from './sorterResultsActions';
import merge from 'lodash.merge';

export const initialState = {
    resultsList: {}
};

const sorterResultsReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case MESSAGES.NEW_SORTER_RESULT_RESOLVE:
            return { ...state, resultsList: Object.assign({}, state.resultsList, { [payload._id]: payload }) };
        case MESSAGES.GET_SORTER_RESULT_RESOLVE:
            return {
                ...state,
                resultsList: Object.assign({}, state.resultsList, {
                    [payload._id]: Object.assign({}, state.resultsList[payload._id], payload)
                })
            };
        case MESSAGES.POPULATE_SORTER_RESULTS_STATE:
            let resultsList = { ...state.resultsList };
            payload.forEach((res) => {
                if (!resultsList[res._id]) resultsList[res._id] = {};
                let resObj = merge({}, state.resultsList[res._id], res);
                resultsList[res._id] = resObj;
            });
            return { ...state, resultsList };
        default:
            return state;
    }
};

export default sorterResultsReducer;
