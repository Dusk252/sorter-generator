import { push } from 'connected-react-router';
import { select, take, put, call, takeLatest, all } from 'redux-saga/effects';
import * as AuthActions from './../auth/authActions';
import * as AppActions from './appActions';
import { matchRoutes } from 'react-router-config';
import { refreshToken } from './../apiCalls';
import routesSpec from './../../routes';
import { LOCATION_CHANGE } from 'connected-react-router';

const { SIGNALS: AUTH_SIGNALS, MESSAGES: AUTH_MESSAGES, ...authActions } = AuthActions;
const { SIGNALS, MESSAGES, ...actions } = AppActions;

const getAccessToken = (state) => state.auth.accessToken;

function* execAuthenticatedCall({ apiCall, args }) {
    let accessToken = yield select(getAccessToken);
    try {
        const res = yield call(apiCall, ...args, accessToken);
        yield put(actions.resolvePrivateCall(res));
    } catch (err) {
        if (err.response && err.response.status === 401) {
            yield call(getTokenExecCall, { apiCall, args });
        } else yield put(actions.rejectPrivateCall(err.response.data.message));
    }
}

function* getTokenExecCall({ apiCall, args }) {
    try {
        yield put(authActions.getNewToken());
        const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
        if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) {
            let accessToken = yield select(getAccessToken);
            const res = yield call(apiCall, ...args, accessToken);
            yield put(actions.resolvePrivateCall(res));
        } else yield put(actions.rejectPrivateCall());
    } catch (err) {
        yield put(actions.rejectPrivateCall(err.response.data.message));
    }
}

function* processInitialLoad({ path }) {
    const match = matchRoutes(routesSpec[0].routes, path);
    const accessToken = yield select(getAccessToken);
    if (!accessToken && path != '/login/result') {
        yield put(actions.startRequest());
        try {
            const res = yield call(refreshToken);
            yield put(authActions.resolveGetNewToken({ accessToken: res.data.accessToken, currentUser: res.data.user }));
            //yield call(processGetResults, { idList: res.data.user.sorter_history });
            yield put(authActions.resolveAuth());
            if (path == '/login')
                yield put(push('/'));
            else
                yield put(push(path));
        } catch {
            yield put(authActions.rejectAuth(false));
            yield put(actions.locationChange(path));
            if (match.length && match[0].route.private) yield put(push('/login'));
        }
        yield put(actions.endRequest());
    } else yield put(push(path));
    yield put(actions.setFirstRender(false));
}

function* processRouteChange({ path }) {
    const match = matchRoutes(routesSpec[0].routes, path);
    if (match.length && match[0].route.private) {
        const accessToken = yield select(getAccessToken);
        if (!accessToken) {
            yield put(actions.startRequest());
            try {
                const res = yield call(refreshToken);
                yield put(authActions.resolveGetNewToken({ accessToken: res.data.accessToken, currentUser: res.data.user }));
                //yield call(processGetResults, { idList: res.data.user.sorter_history });
                yield put(authActions.resolveAuth());
                yield put(push(path));
            } catch {
                yield put(authActions.rejectAuth());
                yield put(authActions.clearAuthError());
                yield put(actions.locationChange(path));
                yield put(push('/login'));
            }
            yield put(actions.endRequest());
        } else yield put(push(path));
    } else yield put(push(path));
}

function* processLocationChange({ payload }) {
    if (payload.location && payload.location.pathname) yield put(actions.locationChange(payload.location.pathname));
}

function* watchInitialLoad() {
    yield takeLatest(SIGNALS.INITIAL_LOAD, processInitialLoad);
}

function* watchRouteChange() {
    yield takeLatest(SIGNALS.CHANGE_ROUTE, processRouteChange);
}

function* watchLocationChange() {
    yield takeLatest(LOCATION_CHANGE, processLocationChange);
}

function* watchAuthenticatedCall() {
    yield takeLatest(SIGNALS.START_AUTHENTICATED_CALL, execAuthenticatedCall);
}

export default function* () {
    yield all([watchInitialLoad(), watchRouteChange(), watchLocationChange(), watchAuthenticatedCall()]);
}
