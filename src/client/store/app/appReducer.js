import { MESSAGES } from './appActions';
import { LOCATION_CHANGE } from 'connected-react-router';

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
        case LOCATION_CHANGE:
            return { ...state, prevLocation: state.currentLocation, currentLocation: payload.location.pathname };
        default:
            return state;
    }
};

export default appReducer;
