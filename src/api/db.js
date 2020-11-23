module.exports = {
    connect,
    get,
    close
};

const state = {
    db: null
};

function connect(client, dbName, done) {
    if (state.db) return done();

    client.connect(function (err, client) {
        if (err) return done(err);
        state.db = client.db(dbName);
        done();
    });
}

function get() {
    return state.db;
}

function close(done) {
    if (state.db) {
        state.db.close(function (err, result) {
            state.db = null;
            done(err);
        });
    }
}
