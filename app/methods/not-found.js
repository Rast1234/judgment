var db = require('../db'),
    fs = require('fs');

exports.get = function(config, logger) {

    return function(req, res) {

        function render() {

            fs.readFile('./app/templates/404.html', function read(err, view) {

                if (err) {
                    throw err;
                }

                res.send(view.toString());
            });

        }

        render();
        logger.log('info','Process route: ', config);
    }

}
