import { MESSAGES } from './sortersActions';
import merge from 'lodash.merge';

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
                ...state,
                submissionStatus: submissionStatus.SUCCESS
            };
        case MESSAGES.NEW_SORTER_REJECT:
            return { ...state, submissionStatus: submissionStatus.ERROR };
        case MESSAGES.GET_SORTER_RESOLVE:
            return {
                ...state,
                sorterList: Object.assign({}, state.sorterList, {
                    [payload._id]: merge({}, state.sorterList[payload._id], payload)
                })
            };
        case MESSAGES.GET_SORTER_VERSION_RESOLVE:
            let updatedSorter = state.sorterList[payload.id];
            if (updatedSorter) {
                const infoIndex = updatedSorter.info.findIndex((el) => el.version_id === payload.version.version_id);
                if (infoIndex > -1)
                    updatedSorter = Object.assign({}, updatedSorter, {
                        info: Object.assign([], [...updatedSorter.info], {
                            [infoIndex]: merge({}, updatedSorter.info[infoIndex], payload.version)
                        })
                    });
                else updatedSorter = Object.assign({}, updatedSorter, { info: [...updatedSorter.info, payload.version] });
                return {
                    ...state,
                    sorterList: Object.assign({}, state.sorterList, { [payload.id]: updatedSorter })
                };
            } else return state;
        case MESSAGES.INCREMENT_TAKE_COUNT:
            return {
                ...state,
                sorterList: Object.assign({}, state.sorterList, {
                    [payload]: merge({}, state.sorterList[payload], {
                        meta: { times_taken: state.sorterList[payload].meta.times_taken + 1 }
                    })
                })
            };
        case MESSAGES.POPULATE_SORTERS_STATE:
            let sorterList = { ...state.sorterList };
            payload.forEach((sorter) => {
                if (!sorterList[sorter._id]) sorterList[sorter._id] = {};
                let sorterObj = merge({}, state.sorterList[sorter._id], sorter);
                sorterList[sorter._id] = sorterObj;
            });
            return { ...state, sorterList };
        default:
            return state;
    }
};

export default sortersReducer;
