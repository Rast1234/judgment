var path = require('path'),
    fs = require('fs'),
    winston = require('winston'),
    config = require('../config').logger;

var activated = false;

exports.init = function(name, done) {
    var path = config.path;

    function prepare() {

        fs.mkdir(path,function(err){

            if (err) {
                done(err, null);
                return;
            }

            start();
        });

    }

    function start() {

        winston.add(winston.transports.File, { filename: path + '/' + name + '.log' });

        activated = true;
        done(null, winston);
    }

    if (activated) {
        done(null, winston);
        return
    }

    if (!fs.existsSync(path)) {
        prepare();
        return;
    }

    start();
};