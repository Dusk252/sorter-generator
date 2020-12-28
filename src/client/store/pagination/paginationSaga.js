import { put, takeLatest, all, take } from 'redux-saga/effects';
import * as PageActions from './paginationActions';
import { requestList, requestListUpdate } from './../apiCalls';
import { startRequest, endRequest } from './../app/appActions';
import { startAuthenticatedCall as startCall, MESSAGES as APP_MESSAGES } from './../app/appActions';

const { SIGNALS, MESSAGES, ...actions } = PageActions;

//const getAccessToken = (state) => state.auth.accessToken;

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

function* processGetUpdatedPages({ name, count, lastUpdated }) {
    yield put(startRequest());
    yield put(actions.startPageRequest());
    yield put(startCall(requestListUpdate, [name, count ?? 0, lastUpdated]));
    const action = yield take([APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED, APP_MESSAGES.AUTHENTICATED_CALL_REJECTED]);
    if (action.type === APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED) {
        const res = action.payload;
        yield put(actions.populateState({ name, payload: res.data }));
        yield put(actions.resolveGetUpdated({ name, payload: { items: res.data } }));
    } else {
        yield put(actions.rejectPageRequest());
    }
    yield put(endRequest());
}

function* watchGetPage() {
    yield takeLatest(SIGNALS.GET_PAGE, processGetPage);
}

function* watchUpdatePages() {
    yield takeLatest(SIGNALS.GET_UPDATED, processGetUpdatedPages);
}

export default function* () {
    yield all([watchGetPage(), watchUpdatePages()]);
}
