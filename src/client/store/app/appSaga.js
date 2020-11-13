import { push } from 'connected-react-router';
import { select, put, call, takeLatest, all } from 'redux-saga/effects';
import * as AuthActions from './../auth/authActions';
import * as AppActions from './appActions';
import { processGetResults } from './../sorterResults/sorterResultsSaga';
import { matchRoutes } from 'react-router-config';
import { refreshToken } from './../apiCalls';
import routesSpec from './../../routes';
import { LOCATION_CHANGE } from 'connected-react-router';

const { SIGNALS: AUTH_SIGNALS, MESSAGES: AUTH_MESSAGES, ...authActions } = AuthActions;
const { SIGNALS, MESSAGES, ...actions } = AppActions;

const getUser = (state) => state.auth.currentUser;

function* processInitialLoad({ path }) {
    const match = matchRoutes(routesSpec[0].routes, path);
    const user = yield select(getUser);
    if (!user) {
        yield put(actions.startRequest());
        try {
            const res = yield call(refreshToken);
            yield put(authActions.resolveGetNewToken({ accessToken: res.data.accessToken, currentUser: res.data.user }));
            yield call(processGetResults, { idList: res.data.user.sorter_history });
            yield put(authActions.resolveAuth());
            yield put(push(path));
        } catch {
            yield put(authActions.resolveAuth());
            yield put(authActions.clearAuthError());
            yield put(actions.locationChange(path));
            if (match.length && match[0].route.private) yield put(push('/login'));
        }
        yield put(actions.endRequest());
    } else yield put(push(path));
    yield put(actions.setFirstRender(false));
}

function* processRouteChange({ path }) {
    const match = matchRoutes(routesSpec[0].routes, path);
    const user = yield select(getUser);
    if (!user && match.length && match[0].route.private) {
        yield put(actions.startRequest());
        try {
            const res = yield call(refreshToken);
            yield put(authActions.resolveGetNewToken({ accessToken: res.data.accessToken, currentUser: res.data.user }));
            yield call(processGetResults, { idList: res.data.user.sorter_history });
            yield put(authActions.resolveAuth());
            yield put(push(path));
        } catch {
            yield put(authActions.resolveAuth());
            yield put(authActions.clearAuthError());
            yield put(actions.locationChange(path));
            yield put(push('/login'));
        }
        yield put(actions.endRequest());
    } else yield put(push(path));
}

function* processLocationChange({ payload }) {
    if (payload.location && payload.location.pathname) yield put(actions.locationChange(payload.location.pathname));
}

function* watchInitialLogin() {
    yield takeLatest(SIGNALS.INITIAL_LOAD, processInitialLoad);
}

function* watchRouteChange() {
    yield takeLatest(SIGNALS.CHANGE_ROUTE, processRouteChange);
}

function* watchLocationChange() {
    yield takeLatest(LOCATION_CHANGE, processLocationChange);
}

export default function* () {
    yield all([watchInitialLogin(), watchRouteChange(), watchLocationChange()]);
}
