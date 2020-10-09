import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { renderRoutes } from 'react-router-config';
import createStore from './store/index';
import routes from './routes';
import { BrowserRouter } from 'react-router-dom';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { Provider } from 'react-redux';

const state = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const store = createStore(state);
const insertCss = (...styles) => {
    const removeCss = styles.map((style) => style._insertCss());
    return () => removeCss.forEach((dispose) => dispose());
};

ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <StyleContext.Provider value={{ insertCss }}>{renderRoutes(routes)}</StyleContext.Provider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);
