import { MESSAGES } from './usersActions';
import merge from 'lodash.merge';

export const initialState = {
    userList: {}
};

const usersReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case MESSAGES.POPULATE_USERS_STATE:
            let userList = { ...state.userList };
            payload.forEach((user) => {
                if (!userList[user._id]) userList[user._id] = {};
                let userObj = Object.assign({}, userList[sorter._id]);
                userObj.base_info = user;
                userList[user._id].base_info = userObj;
            });
            return { ...state, userList };
        case MESSAGES.GET_USER_RESOLVE:
            console.log(payload);
            return state;
        case MESSAGES.GET_SELF_RESOLVE:
            console.log(payload);
            return state;
        default:
            return state;
    }
};

export default usersReducer;
