import { put, call, takeLatest, all, select, take } from 'redux-saga/effects';
import * as UserActions from './usersActions';
import { getNewToken, MESSAGES as AUTH_MESSAGES } from './../auth/authActions';
import { startRequest, endRequest } from './../app/appActions';
import { processGetResults } from './../sorterResults/sorterResultsSaga';
import { requestList, getUserProfile } from './../apiCalls';

const { SIGNALS, MESSAGES, ...actions } = UserActions;

const getAccessToken = (state) => state.auth.accessToken;
const getCurrentUserId = (state) => state.auth.currentUser._id;

function* processGetUser({ id }) {
    yield put(startRequest());
    try {
        let accessToken = yield select(getAccessToken);
        if (!accessToken) {
            yield put(getNewToken());
            const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
            if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) {
                accessToken = yield select(getAccessToken);
            } else throw new Error('Unauthorized user');
        }
        const res = yield call(getUserProfile, id);
        yield put(actions.resolveGetUser(res.data));
    } catch {
        yield put(actions.rejectGetUser());
    }
    yield put(endRequest());
}

function* processGetSelf() {
    yield put(startRequest());
    try {
        let accessToken = yield select(getAccessToken);
        if (!accessToken) {
            yield put(getNewToken());
            const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
            if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) {
                accessToken = yield select(getAccessToken);
            } else throw new Error('Unauthorized user');
        }
        const id = yield select(getCurrentUserId);
        if (id) {
            const res = yield call(getUserProfile, id, accessToken);
            yield put(actions.resolveGetSelf(res.data));
            yield call(processGetResults, { idList: res.data.sorter_history });
        }
    } catch {
        yield put(actions.rejectGetSelf());
    }
    yield put(endRequest());
}

function* watchGetUser() {
    yield takeLatest(SIGNALS.GET_USER_START, processGetUser);
}

function* watchGetSelf() {
    yield takeLatest(SIGNALS.GET_SELF_START, processGetSelf);
}

export default function* () {
    yield all([watchGetUser(), watchGetSelf()]);
}
