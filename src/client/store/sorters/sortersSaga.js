import { put, call, takeLatest, all, select, take, debounce } from 'redux-saga/effects';
import * as SorterActions from './sortersActions';
import { getNewToken, MESSAGES as AUTH_MESSAGES } from './../auth/authActions';
import { startRequest, endRequest } from './../app/appActions';
import { createSorter, getSorterById, getSorterVersionById, incrementSorterViews } from './../apiCalls';
import { set, del } from 'idb-keyval';

const { SIGNALS, MESSAGES, ...actions } = SorterActions;

const STORAGE_KEY = 'NEW_SORTER_DRAFT';

const getAccessToken = (state) => state.auth.accessToken;
const getIdbStore = (state) => state.app.idbStore;

function* processNewSorterSubmit({ sorter }) {
    yield put(startRequest());
    yield put(actions.requestNewSorter());
    try {
        let accessToken = yield select(getAccessToken);
        if (!accessToken) {
            yield put(getNewToken());
            const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
            if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) {
                accessToken = yield select(getAccessToken);
            } else throw new Error('Unauthorized user');
        }
        const res = yield call(createSorter, sorter, accessToken);
        yield put(actions.resolveNewSorter(res.data));
        const idbStore = yield select(getIdbStore);
        if (idbStore) yield call(del, STORAGE_KEY, idbStore);
    } catch {
        yield put(actions.rejectNewSorter());
    }
    yield put(endRequest());
}

function* processUpdateSorterDraft({ newFormState }) {
    const idbStore = yield select(getIdbStore);
    if (idbStore) {
        yield call(set, STORAGE_KEY, { submissionForm: newFormState }, idbStore);
    }
}

function* processGetSorter({ id, getUserInfo, versionId }) {
    yield put(startRequest());
    yield put(actions.requestGetSorter());
    try {
        let accessToken = yield select(getAccessToken);
        if (!accessToken) {
            yield put(getNewToken());
            const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
            if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) {
                accessToken = yield select(getAccessToken);
            } else {
                accessToken = null;
            }
        }
        const res = yield call(getSorterById, id, getUserInfo, versionId);
        yield put(actions.resolveGetSorter(res.data));
    } catch {
        yield put(actions.rejectGetSorter());
    }
    yield put(endRequest());
}

function* processGetSorterVersion({ id, versionId }) {
    yield put(startRequest());
    yield put(actions.requestGetSorterVersion());
    try {
        let accessToken = yield select(getAccessToken);
        if (!accessToken) {
            yield put(getNewToken());
            const action = yield take([AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED, AUTH_MESSAGES.AUTH_REJECTED]);
            if (action.type === AUTH_MESSAGES.GET_NEW_TOKEN_RESOLVED) {
                accessToken = yield select(getAccessToken);
            } else {
                accessToken = null;
            }
        }
        const res = yield call(getSorterVersionById, id, versionId);
        yield put(actions.resolveGetSorterVersion(id, res.data));
    } catch {
        //yield put(actions.rejectGetSorterVersion());
    }
    yield put(endRequest());
}

function* processIncrementViewCount({ id }) {
    try {
        yield call(incrementSorterViews, id);
    } catch (err) {}
}

function* watchNewSorterSubmit() {
    yield takeLatest(SIGNALS.NEW_SORTER_SUBMIT, processNewSorterSubmit);
}

function* watchUpdateSorterDraft() {
    yield debounce(1000, SIGNALS.UPDATE_SORTER_DRAFT, processUpdateSorterDraft);
}

function* watchGetSorter() {
    yield takeLatest(SIGNALS.GET_SORTER_START, processGetSorter);
}

function* watchGetSorterVersion() {
    yield takeLatest(SIGNALS.GET_SORTER_VERSION_START, processGetSorterVersion);
}

function* watchSorterViewCount() {
    yield takeLatest(SIGNALS.INCREMENT_VIEW_COUNT, processIncrementViewCount);
}

export default function* () {
    yield all([
        watchNewSorterSubmit(),
        watchUpdateSorterDraft(),
        watchGetSorter(),
        watchGetSorterVersion(),
        watchSorterViewCount()
    ]);
}
