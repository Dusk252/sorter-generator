import { MESSAGES } from './appActions';

export const initialState = {
    isLoading: false,
    error: null
};

const appReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case MESSAGES.REQUEST_START:
            return { ...state, isLoading: true };
        case MESSAGES.REQUEST_END:
            return { ...state, isLoading: false };
        default:
            return state;
    }
};

export default appReducer;
