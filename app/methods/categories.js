var categories = require('../models/categories');

exports.get = function(config, logger) {

    return function(req, res) {

        function render(err, data) {

            if (err) {
                logger.log('error', 'Method error: ', err);
                res.send(500, { error: 'Server error, please try later' });
                return;
            }

            var body = JSON.stringify(data);

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Length', body.length);
            res.send(body);

        }

        categories.list(render)
        logger.log('info','Process route: ', config, req.params);
    }

}