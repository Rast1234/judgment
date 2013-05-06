var db = require('../db');

exports.list = function (done) {

    function find(col) {
        col.find().toArray(done)
    }

    db.collection('categories', find);
}