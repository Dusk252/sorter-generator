import { put, call, takeLatest, all, select, take } from 'redux-saga/effects';
import * as SorterActions from './sortersActions';
import { getNewToken, MESSAGES as AUTH_MESSAGES, SIGNALS as AUTH_SIGNALS } from './../auth/authActions';
import { createSorter } from './../../apiCalls/privateCalls';

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
        yield put(actions.resolveNewSorter({ sorter: res.data.sorter }));
    } catch {
        yield put(actions.rejectNewSorter());
    }
}

function* watchNewSorterSubmit() {
    yield takeLatest(SIGNALS.NEW_SORTER_SUBMIT, processNewSorterSubmit);
}

export default function* () {
    yield all([watchNewSorterSubmit()]);
}
