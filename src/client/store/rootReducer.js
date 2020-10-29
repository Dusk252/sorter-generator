import { combineReducers } from 'redux';
import appReducer from './app/appReducer';
import authReducer from './auth/authReducer';
import paginationReducer from './pagination/paginationReducer';
import usersReducer from './users/usersReducer';
import sortersReducer from './sorters/sortersReducer';

export default combineReducers({
    app: appReducer,
    auth: authReducer,
    pages: paginationReducer,
    users: usersReducer,
    sorters: sortersReducer
});
