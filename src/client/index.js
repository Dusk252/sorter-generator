import React from 'react'
import { hydrate } from 'react-dom'
import App from '../shared/App'
import { BrowserRouter } from 'react-router-dom'

if (module.hot) {
  module.hot.accept('../shared/App', () => {
    const NextApp = require('../shared/App').default;
    hydrate(
      <BrowserRouter>
        <NextApp />
      </BrowserRouter>,
      document.getElementById('app')
    );
  })
}

hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('app')
);