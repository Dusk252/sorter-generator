import { put, call, takeLatest, all } from 'redux-saga/effects';
import * as PageActions from './paginationActions';
import { requestList, checkList, requestListNew } from './../apiCalls';
import { startRequest, endRequest } from './../app/appActions';

const { SIGNALS, MESSAGES, ...actions } = PageActions;

const getAccessToken = (state) => state.auth.accessToken;

function* processGetPage({ name, count, lastUpdated, isPrivate }) {
    yield put(startRequest());
    yield put(actions.startPageRequest());
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
        const res = yield call(requestList, name, count ?? 0, lastUpdated, accessToken);
        yield put(actions.populateState({ name, payload: res.data }));
        yield put(actions.resolvePageRequest({ name, payload: { items: res.data } }));
    } catch {
        yield put(actions.rejectPageRequest({ error: err.error }));
    }
    yield put(endRequest());
}

// function* processCheckNew({ name, lastUpdated, isPrivate }) {
//     try {
//         let accessToken = null;
//         if (isPrivate) {
//             accessToken = yield select(getAccessToken);
//             if (!accessToken) {
//                 yield put(getNewToken());
//                 const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
//                 if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) {
//                     accessToken = yield select(getAccessToken);
//                 } else throw new Error('Unauthorized user');
//             }
//         }
//         const res = yield call(checkList, name, lastUpdated, accessToken);
//         yield put(actions.resolveCheckNewRequest({ name, payload: res.data }));
//     } catch {}
// }

function* processGetNewItems({ name, lastUpdated, isPrivate }) {
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
        const newCount = yield call(checkList, name, lastUpdated, accessToken);
        if (newCount) {
            yield put(startRequest());
            const res = yield call(requestListNew, name, lastUpdated, accessToken);
            yield put(actions.populateState({ name, payload: res.data }));
            yield put(actions.resolveGetNewItems({ name, payload: { items: res.data } }));
            yield put(endRequest());
        }
    } catch {}
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
