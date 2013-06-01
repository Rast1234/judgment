var categories = require('../../models/categories'),
    cros = require('../modules/cros');;

exports.get = function(config, logger) {

    return function(req, res) {

        function render(err, data) {
            res.setHeader('Content-Type', 'application/json');

            if (err) {
                logger.log('error', 'Method error: ', err);
                res.send(500, { error: 'Server error, please try later' });
                return;
            }

            var body = JSON.stringify(data);

            res.send(body);

        }

        res = cros.wrap(res);

        categories.list(render)
        logger.log('info','Process route: ', config, req.params);
    }

}