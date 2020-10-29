import { MESSAGES } from './sortersActions';
import { MESSAGES as PAGEMESSAGES } from './../pagination/paginationActions';

export const submissionStatus = {
    SUCCESS: 0,
    INPROGRESS: 1,
    ERROR: 2
};

export const initialState = {
    submissionStatus: submissionStatus.SUCCESS,
    sorterList: {}
};

const sortersReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case MESSAGES.NEW_SORTER_REQUEST:
            return { ...state, submissionStatus: submissionStatus.INPROGRESS };
        case MESSAGES.NEW_SORTER_RESOLVE:
            return {
                sorterList: Object.assign({}, state.sorterList, { [payload._id]: payload }),
                submissionStatus: 0
            };
        case MESSAGES.NEW_SORTER_REJECT:
            return { ...state, submissionStatus: submissionStatus.ERROR };
        case MESSAGES.GET_SORTER_RESOLVE:
            return {
                ...state,
                sorterList: Object.assign({}, state.sorterList, { [payload._id]: payload }),
                submissionStatus: submissionStatus.SUCCESS
            };
        case PAGEMESSAGES.POPULATE_SORTERS_STATE:
            let sorterList = { ...state.sorterList };
            payload.forEach((sorter) => {
                if (!sorterList[sorter._id]) sorterList[sorter._id] = {};
                let sorterObj = Object.assign({}, sorterList[sorter._id]);
                sorterObj._id = sorter._id;
                sorterObj.base_info = { ...sorter.base_info };
                sorterObj.user_info = sorter.user_info;
                sorterList[sorter._id] = sorterObj;
            });
            return { ...state, sorterList };
        default:
            return state;
    }
};

export default sortersReducer;
