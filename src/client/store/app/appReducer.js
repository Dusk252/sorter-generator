import { MESSAGES } from './appActions';

export const initialState = {
    isLoading: false,
    isFirstRender: true,
    error: null
};

const appReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case MESSAGES.REQUEST_START:
            return { ...state, isLoading: true };
        case MESSAGES.REQUEST_END:
            return { ...state, isLoading: false };
        case MESSAGES.SET_FIRST_RENDER:
            return { ...state, isFirstRender: payload };
        case MESSAGES.LOCATION_CHANGE:
            return { ...state, prevLocation: state.currentLocation, currentLocation: payload.newLocation };
        default:
            return state;
    }
};

export default appReducer;
