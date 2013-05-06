define(function (require, exports) {
    'use strict';

    require('mustache');

    var bus = require('bus');

    exports.create = function (container) {

        function search() {
            console.log('search');
        }

        container.on('click', '.btn', search);
    };

});