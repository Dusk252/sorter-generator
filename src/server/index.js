import express from "express";

import React from "react";
import { renderToString } from "react-dom/server"
import { StaticRouter, matchPath } from "react-router-dom"
import routes from '../shared/routes'
import App from '../shared/App';

import bodyParser from "body-parser";
import errorHandler from "./_helpers/error-handler";
import cors from "cors";
import path from "path";
import db from "./db";

const port = process.env.PORT || 3000;
const DIST_DIR = path.join("./dist/public");
const SEED = true;

const app = express();
app.use(express.static(DIST_DIR));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// generic route for server side rendering
app.get("*", (req, res, next) => {
  const activeRoute = routes.find((route) => matchPath(req.url, route)) || {}

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
});

// api routes
app.post("/api/test", (req, res) => {
  res.json({ message: req.body.message + ' from server!' });
});
app.use("/api/users", require("./users/users.controller"));

// global error handler
app.use(errorHandler);

//connect to database
db.connect("mongodb://localhost:27017/", "sorterGenerator", function (err) {
  if (err) {
    console.log("Unable to connect to Mongo.");
    process.exit(1);
  } else {
    //start server
    app.listen(port, function () {
      console.log("Listening on port 3000...");
    });
  }
});