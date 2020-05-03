var MongoClient = require('mongodb').MongoClient

module.exports = {
  connect,
  get,
  close
}

var state = {
  db: null,
}

function connect(url, dbName, done) {
  if (state.db) return done()

  MongoClient.connect(url, function (err, client) {
    if (err) return done(err)
    state.db = client.db(dbName)
    done()
  })
}

function get() {
  return state.db
}

function close(done) {
  if (state.db) {
    state.db.close(function (err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}