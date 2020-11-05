import { combineReducers } from 'redux';
import appReducer from './app/appReducer';
import authReducer from './auth/authReducer';
import paginationReducer from './pagination/paginationReducer';
import usersReducer from './users/usersReducer';
import sortersReducer from './sorters/sortersReducer';
import sorterResultsReducer from './sorterResults/sorterResultsReducer';
import { connectRouter } from 'connected-react-router';

const createRootReducer = (history) =>
    combineReducers({
        router: connectRouter(history),
        app: appReducer,
        auth: authReducer,
        pages: paginationReducer,
        users: usersReducer,
        sorters: sortersReducer,
        results: sorterResultsReducer
    });

export default createRootReducer;
