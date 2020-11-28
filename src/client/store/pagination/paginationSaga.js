import { put, call, takeLatest, all, select, take } from 'redux-saga/effects';
import * as PageActions from './paginationActions';
import { getNewToken, MESSAGES as AUTH_MESSAGES } from './../auth/authActions';
import { requestList, checkList, requestListNew } from './../apiCalls';
import { startRequest, endRequest } from './../app/appActions';
import { startAuthenticatedCall as startCall, MESSAGES as APP_MESSAGES } from './../app/appActions';

const { SIGNALS, MESSAGES, ...actions } = PageActions;

const getAccessToken = (state) => state.auth.accessToken;

function* processGetPage({ name, count, lastUpdated }) {
    yield put(startRequest());
    yield put(actions.startPageRequest());
    yield put(startCall(requestList, [name, count ?? 0, lastUpdated]));
    const action = yield take([APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED, APP_MESSAGES.AUTHENTICATED_CALL_REJECTED]);
    if (action.type === APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED) {
        const res = action.payload;
        yield put(actions.populateState({ name, payload: res.data }));
        yield put(actions.resolvePageRequest({ name, payload: { items: res.data } }));
    } else {
        yield put(actions.rejectPageRequest());
    }
    yield put(endRequest());
}

function* processGetNewItems({ name, lastUpdated }) {
    yield put(startCall(requestListNew, [name, lastUpdated]));
    const action = yield take([APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED, APP_MESSAGES.AUTHENTICATED_CALL_REJECTED]);
    if (action.type === APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED) {
        const newCount = action.payload;
        if (newCount.data) {
            try {
                let accessToken = yield select(getAccessToken);
                yield put(startRequest());
                const res = yield call(requestListNew, name, lastUpdated, accessToken);
                yield put(actions.populateState({ name, payload: res.data }));
                yield put(actions.resolveGetNewItems({ name, payload: { items: res.data } }));
                yield put(endRequest());
            } catch {}
        }
    }
}

function* watchGetPage() {
    yield takeLatest(SIGNALS.GET_PAGE, processGetPage);
}

function* watchGetNewItems() {
    yield takeLatest(SIGNALS.GET_NEW, processGetNewItems);
}

export default function* () {
    yield all([watchGetPage(), watchGetNewItems()]);
}
