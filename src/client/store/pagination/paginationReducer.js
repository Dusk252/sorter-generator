import { MESSAGES } from './paginationActions';

const baseState = {
    currentPage: 0,
    hasMore: true,
    lastUpdated: new Date(0),
    items: []
};

export const initialState = {
    users: baseState,
    sorters: baseState,
    sorter_history: baseState
};

const paginationReducer = (state = initialState, action) => {
    const { type, name, meta, payload } = action;
    switch (type) {
        case MESSAGES.REQUEST_STARTED:
            return { ...state, isFetching: true };
        case MESSAGES.REQUEST_RESOLVED:
            const newState = {
                currentPage: payload.items.length > 0 ? payload.page : payload.page - 1,
                hasMore: payload.items.length > 0,
                lastUpdated: Date.now(),
                filter: state[name].filter,
                items: [...state[name].items]
                // items: meta.prepend
                //     ? [...state[name].items].unshift(payload.items)
                //     : [...state[name].items].push(payload.items)
            };
            payload.items.forEach((item) => {
                newState.items.push(item._id);
            });
            return { ...state, [name]: newState, isFetching: false };
        case MESSAGES.REQUEST_REJECTED:
            return { ...state, isFetching: false, error: payload.error };
        case MESSAGES.RESET_HASMORE_CHECK:
            return { ...state, [name]: { ...[name], hasMore: true } };
        default:
            return state;
    }
};

export default paginationReducer;
