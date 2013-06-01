define(function (require, exports) {
    "use strict";

    require('mustache');

    var transport = require('modules/transport'),
        template = require('text!templates/categories.html');


    exports.create = function (container) {

        function init (err, res) {

            if (err) {
                console.log(err);
                return;
            }

            container.append(Mustache.to_html(template, { categories: res }));
        }

        transport.send('get', 'categories', {}, init);
    };

});