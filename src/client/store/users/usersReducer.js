import { MESSAGES as PAGEMESSAGES } from './../pagination/paginationActions';

export const initialState = {};

const usersReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case PAGEMESSAGES.POPULATE_USERS_STATE:
            let newState = { ...state };
            payload.forEach((user) => {
                if (!newState[user._id]) newState[user._id] = {};
                newState[user._id].baseInfo = user;
            });
            return newState;
        default:
            return state;
    }
};

export default usersReducer;
