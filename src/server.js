/* eslint-disable no-unused-vars */
import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import url from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import db from './api/db';
import errorHandler from './api/_helpers/error-handler';
import compression from 'compression';
import renderer from './helpers/renderer';
import { createStore } from 'redux';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import createRootReducer from './client/store/rootReducer';
import ignoreFavicon from './api/_middleware/ignoreFavicon';
import { MongoClient } from 'mongodb';
require('./api/auth/passportConfig');

const port = process.env.PORT || 3000;
const app = express();
function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
}

//f production build send js files as their gzipped versions
if (process.env.NODE_ENV === 'production') {
    app.use('*.js', function (req, res, next) {
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
        res.set('Content-Type', 'text/javascript');
        return next();
    });
}

app.use(helmet());
app.use(cors());
app.use(morgan('combined')); //logging http requests
app.use(express.static(path.join(__dirname, '/../public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(passport.initialize());

app.use(
    compression({
        level: 2, // set compression level from 1 to 9 (6 by default)
        filter: shouldCompress // set predicate to determine whether to compress
    })
);

// api routes
app.post('/api/test', (req, res) => res.json({ message: req.body.message + ' from server' }));
app.use('/api/users', require('./api/users/users.controller'));
app.use('/api/sorters', require('./api/sorters/sorters.controller'));
app.use('/api/sorter_results', require('./api/sorterResults/sorterResults.controller'));
app.use('/api/auth', require('./api/auth/auth.controller'));

// global error handler
app.use(errorHandler);

//ignore favicon request
app.use(ignoreFavicon);

// let router handle routes for server side rendering
app.use(/\/((?!api).)*/, (req, res) => {
    // We create store before rendering html
    let parsedUrl = url.parse(req.originalUrl);
    const store = createStore(createRootReducer({}), {
        app: {
            //currentLocation: parsedUrl.path,
            isFirstRender: true
        },
        router: {
            location: {
                pathname: parsedUrl.path,
                search: parsedUrl.search,
                hash: parsedUrl.hash,
                query: new URLSearchParams(parsedUrl.query)
            },
            action: 'PUSH'
        }
    });
    const context = {};
    const content = renderer(req, store, context);

    if (context.notFound) {
        res.status(404);
    }

    res.send(content);
});

//connect to database
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
db.connect(client, process.env.MONGO_DB, function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    } else {
        //start server
        app.listen(port, function () {
            console.log(`Listening on port ${port}...`);
        });
        //clean database on exit
        process.on('exit', () => {
            db.close();
        });
    }
});
