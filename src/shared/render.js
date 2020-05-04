import React from "react";
import { renderToString } from "react-dom/server"
import { StaticRouter, matchPath } from "react-router-dom"
//1import routes from './routes'
import App from './App';

export default function serverRenderer() {
  return (req, res) => {
    //const activeRoute = routes.find((route) => matchPath(req.url, route)) || {}

    const markup = renderToString(
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    )

    res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SSR with RR</title>
            <script src="/bundle.js" defer></script>
          </head>
  
          <body>
            <div id="app">${markup}</div>
          </body>
        </html>
      `);
  };
}