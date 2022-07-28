import { push, replace } from 'connected-react-router';
import { put, select, call, delay, takeLatest, all } from 'redux-saga/effects';
import * as AuthActions from './authActions';
import { matchRoutes } from 'react-router-config';
import routesSpec from './../../routes';
import { refreshToken, localLogin, logout } from './../apiCalls';

const { SIGNALS, MESSAGES, ...actions } = AuthActions;
const getCurrentLocation = (state) => state.app.currentLocation;

function* processLocalLogin({ email, password }) {
    yield put(actions.requestAuth());
    try {
        yield call(localLogin, email, password);
        yield put(actions.resolveAuth());
        yield put(push('/login/result'));
    } catch {
        yield put(actions.rejectAuth());
    }
}

function* processGetNewToken({ redirect }) {
    yield put(actions.requestAuth());
    try {
        const res = yield call(refreshToken);
        yield put(actions.resolveGetNewToken({ accessToken: res.data.accessToken, currentUser: res.data.user }));
        //yield call(processGetResults, { idList: res.data.user.sorter_history });
        if (redirect) {
            yield delay(2000);
            yield put(replace('/profile'));
        }
        yield put(actions.resolveAuth());
    } catch {
        yield put(actions.rejectAuth());
    }
}

function* processLogout() {
    try {
        const currentLocation = yield select(getCurrentLocation);
        const match = matchRoutes(routesSpec[0].routes, currentLocation);
        yield call(logout);
        yield put(actions.clearUser());
        if (match.length && match[0].route.private)
            yield put(push('/'));
        else 
            yield put(replace(currentLocation ?? '/'));
    } catch {
        yield put(push('/'));
    }
}

function* watchLocalLogin() {
    yield takeLatest(SIGNALS.LOCAL_LOGIN, processLocalLogin);
}

function* watchGetNewToken() {
    yield takeLatest(SIGNALS.GET_NEW_TOKEN, processGetNewToken);
}

function* watchLogout() {
    yield takeLatest(SIGNALS.LOGOUT, processLogout)
}

export default function* () {
    yield all([watchLocalLogin(), watchGetNewToken(), watchLogout()]);
}
