import { MESSAGES as PAGEMESSAGES } from './../pagination/paginationActions';

export const initialState = {
    userList: {}
};

const usersReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case PAGEMESSAGES.POPULATE_USERS_STATE:
            let userList = { ...state.userList };
            payload.forEach((user) => {
                if (!userList[user._id]) userList[user._id] = {};
                let userObj = Object.assign({}, sorterList[sorter._id]);
                userObj.baseInfo = user;
                userList[user._id].baseInfo = userObj;
            });
            return { ...state, userList };
        default:
            return state;
    }
};

export default usersReducer;
