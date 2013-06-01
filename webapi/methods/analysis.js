var async = require('async'),
    domain = require('domain').create(),
    cros = require('../modules/cros'),
    rustem = require('rustem'),
    classifier = require('../../modules/bayes'),
    categories = require('../../models/categories'),
    sockets = require('../modules/sockets');

function Buffer() {
    var buffer = [];

    this.add = function(result) {
        buffer.push(result);
        return buffer.length - 1;
    };

    this.get = function(id) {
        return buffer[id];
    }

    this.update = function(id, result) {
        buffer[id] = result;
    }

    this.remove = function(id) {
        buffer[id] = undefined;
    };

};

var buffer = new Buffer();

exports.post = function(config, logger) {

    return function(req, res) {
        var queue = buffer.add({ready: false});

        function complete(res) {
            buffer.update(queue, {ready: true, data: res, current: req.body.category});
            sockets.emit(req.body.session, 'analysis:complete', {ready: true, results: res, current: req.body.category});
        }

        function start(err, list) {

            rustem.recognize(req.body.text, domain.intercept(function(stems) {

                function process(cat) {

                    return function(done) {

                        classifier.classify(cat.catId, stems, function(err, data) {

                            done(err, {
                                cat: cat.catId,
                                data: data
                            });

                        });

                    }

                }

                async.series(list.map(process), domain.intercept(complete));
            }));

        }

        var body = JSON.stringify({number: queue});

        res = cros.wrap(res);
        res.setHeader('Content-Type', 'application/json');
        res.send(body);


        categories.list(start);
        logger.log('info','Process route: ', config, req.params);
    }

};

exports.get = function (config, logger) {

    return function(req, res) {
        var id = req.params.id,
            result = buffer.get(id);

        res = cros.wrap(res);
        res.setHeader('Content-Type', 'application/json');

        res.send(result);

        result && result.ready && buffer.remove(id);
    };

};