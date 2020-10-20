const keyMirror = require('keyMirror');

export const SIGNALS = keyMirror({
    NEW_SORTER_SUBMIT: null,
    GET_SORTER_START: null
});

export const MESSAGES = keyMirror({
    GET_SORTER_REQUEST: null,
    GET_SORTER_RESOLVE: null,
    GET_SORTER_REJECT: null,
    NEW_SORTER_REQUEST: null,
    NEW_SORTER_RESOLVE: null,
    NEW_SORTER_REJECT: null,
    CLEAR_SUBMISSION_ERROR: null
});

export const submitNewSorter = (sorter) => ({ type: SIGNALS.NEW_SORTER_SUBMIT, sorter });
export const getSorter = (id) => ({ type: SIGNALS.GET_SORTER_START, id });

export const requestNewSorter = () => ({ type: MESSAGES.NEW_SORTER_REQUEST });
export const resolveNewSorter = (sorter) => ({ type: MESSAGES.NEW_SORTER_RESOLVE, payload: sorter });
export const rejectNewSorter = () => ({ type: MESSAGES.NEW_SORTER_REJECT });
export const clearSubmissionError = () => ({ type: MESSAGES.CLEAR_SUBMISSION_ERROR });

export const requestGetSorter = () => ({ type: MESSAGES.GET_SORTER_REQUEST });
export const resolveGetSorter = (sorter) => ({ type: MESSAGES.GET_SORTER_RESOLVE, payload: sorter });
export const rejectGetSorter = () => ({ type: MESSAGES.GET_SORTER_REJECT });
