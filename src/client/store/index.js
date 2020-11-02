import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import createRootReducer from './rootReducer';
import rootSaga from './rootSaga';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
const sagaMiddleware = createSagaMiddleware();

export default (initialState, history) => {
    const store = createStore(
        createRootReducer(history),
        initialState,
        composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(history), reduxImmutableStateInvariant()))
    );
    sagaMiddleware.run(rootSaga);
    return store;
};
