import { MESSAGES } from './sortersActions';
import { MESSAGES as PAGEMESSAGES } from './../pagination/paginationActions';

export const initialState = {
    submitSorterError: false,
    sorterList: {}
};

const sortersReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case MESSAGES.NEW_SORTER_RESOLVE:
            return { ...state, submitSorterError: false };
        case MESSAGES.NEW_SORTER_REJECT:
            return { ...state, submitSorterError: true };
        case MESSAGES.CLEAR_SUBMISSION_ERROR:
            return { ...state, submitSorterError: false };
        case PAGEMESSAGES.POPULATE_SORTERS_STATE:
            let sorterList = { ...state.sorterList };
            payload.forEach((sorter) => {
                if (!sorterList[sorter._id]) sorterList[sorter._id] = {};
                sorterList[sorter._id].baseInfo = { _id: sorter._id, ...sorter.basic_info };
            });
            return { ...state, sorterList };
        default:
            return state;
    }
};

export default sortersReducer;
