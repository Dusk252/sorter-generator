import { all } from 'redux-saga/effects';
import appSaga from './app/appSaga';
import authSaga from './auth/authSaga';
import usersSaga from './users/usersSaga';
import sortersSaga from './sorters/sortersSaga';
import sorterResultsSaga from './sorterResults/sorterResultsSaga';
import paginationSaga from './pagination/paginationSaga';

export default function* rootSaga() {
    yield all([appSaga(), authSaga(), paginationSaga(), usersSaga(), sortersSaga(), sorterResultsSaga()]);
}
