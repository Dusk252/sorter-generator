import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
const sagaMiddleware = createSagaMiddleware();

export default (initialState) => {
    const store = createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(sagaMiddleware, reduxImmutableStateInvariant()))
    );
    sagaMiddleware.run(rootSaga);
    return store;
};
