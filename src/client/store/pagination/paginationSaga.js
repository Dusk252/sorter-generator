import { put, call, takeLatest, all } from 'redux-saga/effects';
import * as PageActions from './paginationActions';
import { requestList } from './../apiCalls';
import { startRequest, endRequest } from './../app/appActions';

const { SIGNALS, MESSAGES, ...actions } = PageActions;

const getAccessToken = (state) => state.auth.accessToken;

function* processGetPage({ name, page, isPrivate }) {
    yield put(startRequest());
    yield put(actions.startRequest());
    try {
        let accessToken = null;
        if (isPrivate) {
            accessToken = yield select(getAccessToken);
            if (!accessToken) {
                yield put(getNewToken());
                const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
                if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) {
                    accessToken = yield select(getAccessToken);
                } else throw new Error('Unauthorized user');
            }
        }
        const res = yield call(requestList, name, page, accessToken);
        yield put(actions.populateState({ name, payload: res.data }));
        yield put(actions.resolveRequest({ name, meta: null, payload: { page: page, items: res.data } }));
    } catch (err) {
        yield put(actions.rejectRequest({ error: err.error }));
    }
    yield put(endRequest());
}

function* watchGetPage() {
    yield takeLatest(SIGNALS.GET_PAGE, processGetPage);
}

export default function* () {
    yield all([watchGetPage()]);
}
