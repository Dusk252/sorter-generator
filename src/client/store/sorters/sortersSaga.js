import { put, call, takeLatest, all, select, take } from 'redux-saga/effects';
import * as SorterActions from './sortersActions';
import { getNewToken, MESSAGES as AUTH_MESSAGES, SIGNALS as AUTH_SIGNALS } from './../auth/authActions';
import { createSorter, getSorterById } from './../apiCalls';

const { SIGNALS, MESSAGES, ...actions } = SorterActions;

const getAccessToken = (state) => state.auth.accessToken;

function* processNewSorterSubmit({ sorter }) {
    yield put(actions.requestNewSorter());
    try {
        let accessToken = yield select(getAccessToken);
        if (!accessToken) {
            yield put(getNewToken());
            const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
            if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) {
                accessToken = yield select(getAccessToken);
            } else throw new Error('Unauthorized user');
        }
        const res = yield call(createSorter, sorter, accessToken);
        yield put(actions.resolveNewSorter(res.data.sorter));
    } catch {
        yield put(actions.rejectNewSorter());
    }
}

function* processGetSorter({ id }) {
    yield put(actions.requestGetSorter());
    try {
        let accessToken = yield select(getAccessToken);
        if (!accessToken) {
            yield put(getNewToken());
            const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
            if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) {
                accessToken = yield select(getAccessToken);
            } else {
                accessToken = null;
            }
        }
        const res = yield call(getSorterById, id, accessToken);
        yield put(actions.resolveGetSorter(res.data));
    } catch (err) {
        console.log(err);
        yield put(actions.rejectGetSorter());
    }
}

function* watchNewSorterSubmit() {
    yield takeLatest(SIGNALS.NEW_SORTER_SUBMIT, processNewSorterSubmit);
}

function* watchGetSorter() {
    yield takeLatest(SIGNALS.GET_SORTER_START, processGetSorter);
}

export default function* () {
    yield all([watchNewSorterSubmit(), watchGetSorter()]);
}
