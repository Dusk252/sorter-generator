import { put, call, takeLatest, all } from 'redux-saga/effects';
import * as PageActions from './paginationActions';
import { requestList } from './../apiCalls';

const { SIGNALS, MESSAGES, ...actions } = PageActions;

function* processGetPage({ name, page, isPrivate }) {
    yield put(actions.startRequest());
    try {
        const res = yield call(requestList, name, page);
        yield put(actions.populateState({ name, payload: res.data }));
        yield put(actions.resolveRequest({ name, meta: null, payload: { page: page, items: res.data } }));
    } catch (err) {
        console.log(err);
        yield put(actions.rejectRequest({ error: err.error }));
    }
}

function* watchGetPage() {
    yield takeLatest(SIGNALS.GET_PAGE, processGetPage);
}

export default function* () {
    yield all([watchGetPage()]);
}
