import { push } from 'connected-react-router';
import { put, call, takeLatest, all, select, take, delay } from 'redux-saga/effects';
import * as SorterActions from './sorterResultsActions';
import { startAuthenticatedCall as startCall, MESSAGES as APP_MESSAGES } from './../app/appActions';
import { startRequest, endRequest } from './../app/appActions';
import { saveSorterResult, getSorterResultById, getSorterResultList } from './../apiCalls';
import { incrementTakeCount } from './../sorters/sortersActions';
import { del } from 'idb-keyval';

const { SIGNALS, MESSAGES, ...actions } = SorterActions;

const getIdbStore = (state) => state.app.idbStore;

const STORAGE_KEY = 'SORTER_PROGRESS_';

function* processNewResultSubmit({ sorterResult }) {
    yield put(startRequest());
    yield put(startCall(saveSorterResult, [sorterResult]));
    const action = yield take([APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED, APP_MESSAGES.AUTHENTICATED_CALL_REJECTED]);
    if (action.type === APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED) {
        const res = action.payload;
        const idbStore = yield select(getIdbStore);
        if (idbStore) yield call(del, STORAGE_KEY + sorterResult.sorter_id, idbStore);
        yield put(actions.resolveNewSorterResult(res.data));
        yield put(incrementTakeCount(sorterResult.sorter_id));
        yield delay(300);
        yield put(push(`/results/${res.data._id}?share=true`));
    } else {
        ///yield put(actions.rejectNewSorter());
    }
    yield put(endRequest());
}

function* processGetResult({ id }) {
    yield put(startRequest());
    yield put(startCall(getSorterResultById, [id]));
    const action = yield take([APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED, APP_MESSAGES.AUTHENTICATED_CALL_REJECTED]);
    if (action.type === APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED) {
        const res = action.payload;
        yield put(actions.resolveGetSorterResult(res.data));
    }
    yield put(endRequest());
}

export function* processGetResults({ idList }) {
    yield put(startRequest());
    yield put(startCall(getSorterResultList, [idList]));
    const action = yield take([APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED, APP_MESSAGES.AUTHENTICATED_CALL_REJECTED]);
    if (action.type === APP_MESSAGES.AUTHENTICATED_CALL_RESOLVED) {
        const res = action.payload;
        const data = Array.isArray(res.data) ? res.data : [res.data];
        yield put(actions.populateSorterResults(data));
    }
    yield put(endRequest());
}

function* watchNewResultSubmit() {
    yield takeLatest(SIGNALS.NEW_SORTER_RESULT_START, processNewResultSubmit);
}

function* watchGetResult() {
    yield takeLatest(SIGNALS.GET_SORTER_RESULT_START, processGetResult);
}

export default function* () {
    yield all([watchNewResultSubmit(), watchGetResult()]);
}
