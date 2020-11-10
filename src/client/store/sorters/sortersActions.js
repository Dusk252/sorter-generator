const keyMirror = require('keyMirror');

export const SIGNALS = keyMirror({
    NEW_SORTER_SUBMIT: null,
    GET_SORTER_START: null,
    GET_SORTER_VERSION_START: null,
    INCREMENT_VIEW_COUNT: null,
    INCREMENT_TAKE_COUNT: null,
    TOGGLE_FAVORITE: null
});

export const MESSAGES = keyMirror({
    GET_SORTER_REQUEST: null,
    GET_SORTER_RESOLVE: null,
    GET_SORTER_REJECT: null,
    GET_SORTER_VERSION_REQUEST: null,
    GET_SORTER_VERSION_RESOLVE: null,
    NEW_SORTER_REQUEST: null,
    NEW_SORTER_RESOLVE: null,
    NEW_SORTER_REJECT: null,
    POPULATE_SORTERS_STATE: null,
    INCREMENT_TAKE_COUNT: null
});

export const submitNewSorter = (sorter) => ({ type: SIGNALS.NEW_SORTER_SUBMIT, sorter });
export const getSorter = (id, getUserInfo, versionId) => ({ type: SIGNALS.GET_SORTER_START, id, getUserInfo, versionId });
export const getSorterVersion = (id, versionId) => ({ type: SIGNALS.GET_SORTER_VERSION_START, id, versionId });
export const incrementViewCount = (id) => ({ type: SIGNALS.INCREMENT_VIEW_COUNT, id });

export const requestNewSorter = () => ({ type: MESSAGES.NEW_SORTER_REQUEST });
export const resolveNewSorter = (sorter) => ({ type: MESSAGES.NEW_SORTER_RESOLVE, payload: sorter });
export const rejectNewSorter = () => ({ type: MESSAGES.NEW_SORTER_REJECT });

export const requestGetSorter = () => ({ type: MESSAGES.GET_SORTER_REQUEST });
export const resolveGetSorter = (sorter) => ({ type: MESSAGES.GET_SORTER_RESOLVE, payload: sorter });
export const rejectGetSorter = () => ({ type: MESSAGES.GET_SORTER_REJECT });

export const requestGetSorterVersion = () => ({ type: MESSAGES.GET_SORTER_VERSION_REQUEST });
export const resolveGetSorterVersion = (id, version) => ({
    type: MESSAGES.GET_SORTER_VERSION_RESOLVE,
    payload: { id, version }
});

export const incrementTakeCount = (id) => ({ type: MESSAGES.INCREMENT_TAKE_COUNT, payload: id });
