import { combineReducers } from 'redux';
import authReducer from './auth/authReducer';
import paginationReducer from './pagination/paginationReducer';
import usersReducer from './users/usersReducer';
import sortersReducer from './sorters/sortersReducer';

export default combineReducers({
    auth: authReducer,
    pages: paginationReducer,
    users: usersReducer,
    sorters: sortersReducer
});
