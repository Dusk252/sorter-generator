const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/server/db');
const serverRenderer = require('./dist/server.js').default;
const errorHandler = require("./src/server/_helpers/error-handler");

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.post("/api/test", (req, res) => res.json({ message: req.body.message + ' from server' }));
app.use("/api/users", require("./src/server/users/users.controller"));

// global error handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
    const config = require('./webpack.config.js');
    const compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler, {
        serverSideRender: true
    }));
    app.use(webpackHotMiddleware(compiler.compilers.find(compiler => compiler.name === 'client')));
    app.use(webpackHotServerMiddleware(compiler));
} else {
    const CLIENT_ASSETS_DIR = path.join(__dirname, '../build/client');
    const CLIENT_STATS_PATH = path.join(CLIENT_ASSETS_DIR, 'stats.json');
    const SERVER_RENDERER_PATH = path.join(__dirname, '../build/server.js');
    const serverRenderer = require(SERVER_RENDERER_PATH);
    const stats = require(CLIENT_STATS_PATH);
    app.use(express.static(CLIENT_ASSETS_DIR));
    app.use(serverRenderer(stats));
}

// let router handle routes for server side rendering
app.use(/\/((?!api).)*/, serverRenderer());

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