import { put, call, takeLatest, all, select, take } from 'redux-saga/effects';
import * as UserActions from './usersActions';
import { getNewToken, MESSAGES as AUTH_MESSAGES } from './../auth/authActions';
import { incrementFavoritesCount, decrementFavoritesCount } from './../sorters/sortersActions';
import { startRequest, endRequest } from './../app/appActions';
import { startAuthenticatedCall as startCall, MESSAGES as APP_MESSAGES } from './../app/appActions';
import { processGetResults } from './../sorterResults/sorterResultsSaga';
import { requestList, getUserProfile, addFavoriteSorter, removeFavoriteSorter } from './../apiCalls';

const { SIGNALS, MESSAGES, ...actions } = UserActions;

const getAccessToken = (state) => state.auth.accessToken;
const getCurrentUserId = (state) => state.auth.currentUser._id;
const getCurrentFavorites = (state) => state.auth.currentUser.favorite_sorters;

function* processGetUser({ id }) {
    yield put(startRequest());
    yield put(startCall(getUserProfile, [id]));
    const action = yield take([APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED, APP_MESSAGES.AUTHENTICATED_CALL_REJECTED]);
    if (action.type === APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED) {
        const res = action.payload;
        yield put(actions.resolveGetUser(res.data));
    } else {
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

function* processToggleFavorite({ id }) {
    yield put(startRequest());
    const favorites = yield select(getCurrentFavorites);
    const isAdd = !favorites.includes(id);
    if (isAdd) yield put(startCall(addFavoriteSorter, [id]));
    else yield put(startCall(removeFavoriteSorter, [id]));
    const action = yield take([APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED, APP_MESSAGES.AUTHENTICATED_CALL_REJECTED]);
    if (action.type === APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED) {
        yield put(actions.resolveToggleFavorite(id, isAdd));
        if (isAdd) yield put(incrementFavoritesCount(id));
        else yield put(decrementFavoritesCount(id));
    }
    yield put(endRequest());
}

function* watchGetUser() {
    yield takeLatest(SIGNALS.GET_USER_START, processGetUser);
}

function* watchGetSelf() {
    yield takeLatest(SIGNALS.GET_SELF_START, processGetSelf);
}

function* watchToggleFavorite() {
    yield takeLatest(SIGNALS.TOGGLE_FAVORITE, processToggleFavorite);
}

export default function* () {
    yield all([watchGetUser(), watchGetSelf(), watchToggleFavorite()]);
}
