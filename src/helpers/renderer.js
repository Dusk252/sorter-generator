import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import serialize from 'serialize-javascript';
import { Helmet } from 'react-helmet';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import routes from '../client/routes';

export default (req, store, context) => {
    const css = new Set();
    const insertCss = (...styles) => styles.forEach((style) => css.add(style._getCss()));
    const content = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.baseUrl} context={context}>
                <StyleContext.Provider value={{ insertCss }}>{renderRoutes(routes)}</StyleContext.Provider>
            </StaticRouter>
        </Provider>
    );
    const helmet = Helmet.renderStatic();

    return `<!DOCTYPE html>
            <head>
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                ${helmet.link.toString()}
                <style>${[...css].join('')}</style>         
            </head>
            <body>
                <div id="app">${content}</div>
                <script>
                    window.__PRELOADED_STATE__ = ${serialize(store.getState()).replace(/</g, '\\u003c')}
                </script>
                <script src="/bundle.js"></script>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            </body>
    </html>`;
};
