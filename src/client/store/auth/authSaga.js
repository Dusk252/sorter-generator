import { push } from 'connected-react-router';
import { put, call, delay, takeLatest, all } from 'redux-saga/effects';
import * as AuthActions from './authActions';
import { refreshToken, localLogin } from './../apiCalls';

const { SIGNALS, MESSAGES, ...actions } = AuthActions;

function* processLocalLogin({ email, password }) {
    yield put(actions.requestAuth());
    try {
        yield call(localLogin, email, password);
        yield put(actions.resolveAuth());
        yield put(push('/Login/result'));
    } catch {
        yield put(actions.rejectAuth());
    }
}

function* processGetNewToken({ redirect }) {
    yield put(actions.requestAuth());
    try {
        const res = yield call(refreshToken);
        yield put(actions.resolveGetNewToken({ accessToken: res.data.accessToken, currentUser: res.data.user }));
        if (redirect) {
            yield delay(2000);
            yield put(push('/'));
        }
    } catch {
        yield put(actions.rejectAuth());
    }
}

function* watchLocalLogin() {
    yield takeLatest(SIGNALS.LOCAL_LOGIN, processLocalLogin);
}

function* watchGetNewToken() {
    yield takeLatest(SIGNALS.GET_NEW_TOKEN, processGetNewToken);
}

export default function* () {
    yield all([watchLocalLogin(), watchGetNewToken()]);
}
