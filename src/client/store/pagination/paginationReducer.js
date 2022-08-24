import { MESSAGES } from './paginationActions';
import merge from 'lodash.merge';

const baseState = {
    hasMore: true,
    lastUpdated: Date.now(),
    items: []
};

export const initialState = {
    users: baseState,
    sorters: baseState,
    sorter_results: baseState
};

const paginationReducer = (state = initialState, action) => {
    const { type, name, payload } = action;
    switch (type) {
        case MESSAGES.REQUEST_STARTED:
            return { ...state, isFetching: true };
        case MESSAGES.REQUEST_RESOLVED: {
            const newItems = payload.items.map((item) => item._id);
            const newState = {
                hasMore: payload.items.length > 0,
                lastUpdated: Date.now(),
                filter: state[name].filter,
                items: payload.new ? [] : [...state[name].items]
            };
            newState.items.push(...newItems);
            return { ...state, [name]: newState, isFetching: false };
        }
        case MESSAGES.REQUEST_REJECTED:
            return { ...state, isFetching: false, error: payload };
        case MESSAGES.RESET_HASMORE_CHECK:
            return { ...state, [name]: { ...state[name], hasMore: true } };
        // case MESSAGES.REQUEST_CHECK_NEW_RESOLVED:
        //     return { ...state, [name]: { ...state[name], hasNew: payload ? true : false } };
        // case MESSAGES.REQUEST_UPDATED_RESOLVED: {
        //     const itemIds = payload.items.map((item) => item._id);
        //     const newState = {
        //         hasMore: state[name].hasMore,
        //         lastUpdated: Date.now(),
        //         filter: state[name].filter,
        //         items: itemIds.concat([...state[name].items])
        //     };
        //     return {
        //         ...state,
        //         [name]: newState,
        //         isFetching: false
        //     };
        // }

        // case SORTER_MESSAGES.NEW_SORTER_RESOLVE:
        //     return {
        //         ...state,
        //         sorters: { ...state.sorters, items: Object.assign([], [payload._id], state.sorters.items) }
        //     };
        default:
            return state;
    }
};

export default paginationReducer;
