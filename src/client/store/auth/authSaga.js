import { push, replace } from 'connected-react-router';
import { put, select, call, delay, takeLatest, all } from 'redux-saga/effects';
import * as AuthActions from './authActions';
import { processGetResults } from './../sorterResults/sorterResultsSaga';
import { refreshToken, localLogin } from './../apiCalls';

const { SIGNALS, MESSAGES, ...actions } = AuthActions;
const getPrevLocation = (state) => state.app.prevLocation;

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
        yield call(processGetResults, { idList: res.data.user.sorter_history });
        if (redirect) {
            const previousLocation = yield select(getPrevLocation);
            yield delay(2000);
            yield put(replace(previousLocation ?? '/profile'));
        }
        yield put(actions.resolveAuth());
    } catch (err) {
        console.log(err);
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
