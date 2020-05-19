import '@babel/polyfill';
import React from 'react'
import ReactDOM from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { createStore } from 'redux';
import reducers from './reducers';
import routes from './routes';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';

const state = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;

const store = createStore(reducers, state);

ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <div>{renderRoutes(routes)}</div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);