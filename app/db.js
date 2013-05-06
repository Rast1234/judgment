var domain = require('domain').create(),
    db = require('mongodb').Db,
    format = require('util').format,
    config = require('../config').db,
    client;

var connection = format('mongodb://%s:%s/judgment', config.host, config.port),
    activated = false;

exports.init = function(done) {

    if (activated) {
        return;
    }

    db.connect(connection, function(err, res) {
        client = res;

        if (err) {
            throw err;
        }

        activated = true;
        client.authenticate(config.user, config.pwd, {authdb: config.name}, domain.intercept(done));
    });

};

exports.collection = function(name, done) {

    if (!activated) {
        throw 'Database inactive!';
    }

    client.collection(name, domain.intercept(done));
};

domain.on('error', function(err) {
    console.log('Database error:', err);
});