const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./_helpers/error-handler');
const port = process.env.PORT || 3000;
const path = require('path');
const DIST_DIR = path.join('./dist/public');
const HTML_FILE = 'index.html';
const db = require('./db');
const seed = true;

app.use(express.static(DIST_DIR));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//default route to serve from same port
app.get('/', (req, res) => {
  res.sendFile(HTML_FILE, { root: DIST_DIR });
});

// api routes
app.use('/api/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

//connect to database
db.connect('mongodb://localhost:27017/', 'sorterGenerator', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.');
    process.exit(1);
  } else {
    //start server
    app.listen(port, function() {
      console.log('Listening on port 3000...')
    });
  }
})