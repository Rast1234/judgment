var db = require('../db');

exports.list = function (query, offset, limit, sort, done) {

    function find(col) {
        col.find(query).sort( { count: sort } ).limit(10).toArray(done);
    }

    db.collection('frequencies', find);
}