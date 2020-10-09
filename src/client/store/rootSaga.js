import { all } from 'redux-saga/effects';
import authSaga from './auth/authSaga';
import usersSaga from './users/usersSaga';
import sortersSaga from './sorters/sortersSaga';
import paginationSaga from './pagination/paginationSaga';

export default function* rootSaga() {
    yield all([authSaga(), paginationSaga()]);
}
