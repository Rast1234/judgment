var db = require('../../db/client');

exports.get = function(config, logger) {

    return function(req, res) {
        var offset = req.params.offset,
            category = req.params.category,
            limit = req.params.limit;

        function find() {
            console.log(offset, category, limit);
            res.send('OK');
        }

        db.collection('frequencies', find);
        logger.log('info','Process route: ', config);
        logger.log('info','Route params: ', req.params);
    }

};