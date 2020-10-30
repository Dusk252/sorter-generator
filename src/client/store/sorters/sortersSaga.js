import { put, call, takeLatest, all, select, take } from 'redux-saga/effects';
import * as SorterActions from './sortersActions';
import { getNewToken, MESSAGES as AUTH_MESSAGES } from './../auth/authActions';
import { startRequest, endRequest } from './../app/appActions';
import { createSorter, getSorterById, incrementSorterViews } from './../apiCalls';

const { SIGNALS, MESSAGES, ...actions } = SorterActions;

const getAccessToken = (state) => state.auth.accessToken;

function* processNewSorterSubmit({ sorter }) {
    yield put(startRequest());
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
        yield put(actions.resolveNewSorter(res.data));
    } catch {
        yield put(actions.rejectNewSorter());
    }
    yield put(endRequest());
}

function* processGetSorter({ id }) {
    yield put(startRequest());
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
    } catch {
        yield put(actions.rejectGetSorter());
    }
    yield put(endRequest());
}

function* processIncrementViewCount({ id }) {
    yield call(incrementSorterViews, id);
}

function* watchNewSorterSubmit() {
    yield takeLatest(SIGNALS.NEW_SORTER_SUBMIT, processNewSorterSubmit);
}

function* watchGetSorter() {
    yield takeLatest(SIGNALS.GET_SORTER_START, processGetSorter);
}

function* watchSorterViewCount() {
    yield takeLatest(SIGNALS.INCREMENT_VIEW_COUNT, processIncrementViewCount);
}

export default function* () {
    yield all([watchNewSorterSubmit(), watchGetSorter(), watchSorterViewCount()]);
}
