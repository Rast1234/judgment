var async = require('async'),
    frequencies = require('../models/frequencies'),
    categories = require('../models/categories'),
    mustache = require('mustache'),
    fs = require('fs');

exports.get = function(config, logger) {

    return function(req, res) {

        function render(err, data) {

            if (err) {
                logger.error(err);
                res.send(500, { error: 'Server error, please try later' });
                return;
            }

            fs.readFile('./app/templates/index.html', function read(err, view) {

                if (err) {
                    throw err;
                }

                res.send(mustache.to_html(view.toString(), data));

            });

        }

        async.series({

            frequencies: function(next){
                frequencies.list({count: {$gt: 2}}, 0, 30, -1, next);
            },

            categories: function(next) {
                categories.list(next);
            }

        }, render)

        logger.log('info','Process route: ', config);
    }

}
