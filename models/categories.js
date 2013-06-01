var db = require('../db/client'),
    async = require('async');

var list;

exports.list = function (done) {

    if (list) {
        done(null, list);
        return;
    }

    function find(err, res) {

        if (err) {
            console.log(err);
            done(err, null);
            return;
        }

        function check(categroy, next) {

            if (err) {
                console.log(err);
                done(err, null);
                return;
            }

            res.fr.find({'catId': categroy.catId}).count(function(err, res) {
                next(res > 0);
            });

        }

        function proccess(err, res) {

            async.filter(res, check, function(res) {
                list = res;
                done(null, res);
            });

        }

        res.cat.find().toArray(proccess)
    }

    async.parallel({

        cat: function(next) {

            db.collection('categories', function(col) {
                next(null, col);
            });

        },

        fr: function(next) {

            db.collection('frequencies', function(col) {
                next(null, col);
            });

        }

    }, find);

}