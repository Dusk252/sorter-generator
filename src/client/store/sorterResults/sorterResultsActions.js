const keyMirror = require('keyMirror');

export const SIGNALS = keyMirror({
    NEW_SORTER_RESULT_START: null,
    GET_SORTER_RESULT_START: null
});

export const MESSAGES = keyMirror({
    NEW_SORTER_RESULT_RESOLVE: null,
    GET_SORTER_RESULT_RESOLVE: null,
    POPULATE_SORTER_RESULTS_STATE: null
});

export const newSorterResult = (sorterResult) => ({ type: SIGNALS.NEW_SORTER_RESULT_START, sorterResult });
export const getSorterResult = (id) => ({ type: SIGNALS.GET_SORTER_RESULT_START, id });

export const resolveNewSorterResult = (sorterResult) => ({
    type: MESSAGES.NEW_SORTER_RESULT_RESOLVE,
    payload: sorterResult
});
//export const rejectNewSorterResult = () => ({ type: MESSAGES.NEW_SORTER_RESULT_REJECT });

export const resolveGetSorterResult = (sorterResult) => ({
    type: MESSAGES.GET_SORTER_RESULT_RESOLVE,
    payload: sorterResult
});
//export const rejectGetSorterResult = () => ({ type: MESSAGES.GET_SORTER_RESULT_REJECT });

export const populateSorterResults = (results) => ({
    type: MESSAGES.POPULATE_SORTER_RESULTS_STATE,
    payload: results
});
