import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { renderRoutes } from 'react-router-config';
import createStore from './store/index';
import routes from './routes';
import { ConnectedRouter } from 'connected-react-router';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

const state = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const history = createBrowserHistory();
const store = createStore(state, history);
const insertCss = (...styles) => {
    const removeCss = styles.map((style) => style._insertCss());
    return () => removeCss.forEach((dispose) => dispose());
};

ReactDOM.hydrate(
    <Provider store={store}>
        <ConnectedRouter history={history} noInitialPop>
            <StyleContext.Provider value={{ insertCss }}>{renderRoutes(routes)}</StyleContext.Provider>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('app')
);
