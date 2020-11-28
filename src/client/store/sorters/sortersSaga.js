import { put, call, take, takeLatest, all, select, debounce } from 'redux-saga/effects';
import * as SorterActions from './sortersActions';
import { startAuthenticatedCall as startCall, MESSAGES as APP_MESSAGES } from './../app/appActions';
import { startRequest, endRequest } from './../app/appActions';
import { createSorter, getSorterById, getSorterVersionById, incrementSorterViews } from './../apiCalls';
import { set, del } from 'idb-keyval';

const { SIGNALS, MESSAGES, ...actions } = SorterActions;

const STORAGE_KEY = 'NEW_SORTER_DRAFT';

const getIdbStore = (state) => state.app.idbStore;

function* processNewSorterSubmit({ sorter }) {
    yield put(startRequest());
    yield put(actions.requestNewSorter());
    yield put(startCall(createSorter, [sorter]));
    const action = yield take([APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED, APP_MESSAGES.AUTHENTICATED_CALL_REJECTED]);
    if (action.type === APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED) {
        const res = action.payload;
        yield put(actions.resolveNewSorter(res.data));
        const idbStore = yield select(getIdbStore);
        if (idbStore) yield call(del, STORAGE_KEY, idbStore);
    } else {
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
    yield put(startCall(getSorterById, [id, getUserInfo, versionId]));
    const action = yield take([APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED, APP_MESSAGES.AUTHENTICATED_CALL_REJECTED]);
    if (action.type === APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED) {
        const res = action.payload;
        yield put(actions.resolveGetSorter(res.data));
    } else {
        yield put(actions.rejectGetSorter());
    }
    yield put(endRequest());
}

function* processGetSorterVersion({ id, versionId }) {
    yield put(startRequest());
    yield put(actions.requestGetSorterVersion());
    yield put(startCall(getSorterVersionById, [id, versionId]));
    const action = yield take([APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED, APP_MESSAGES.AUTHENTICATED_CALL_REJECTED]);
    if (action.type === APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED) {
        const res = action.payload;
        yield put(actions.resolveGetSorterVersion(id, res.data));
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
