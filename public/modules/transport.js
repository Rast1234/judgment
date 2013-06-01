define(function (require, exports) {
    "use strict";

    var trasport = require('reqwest');

    var BASE_PATH = location.protocol + '//localhost:3000/';

    exports.send = function (method, resource, query, complete) {

        trasport({
            url: BASE_PATH + resource,
            method: method,
            contentType: 'application/json',
            type: 'json',
            crossOrigin: true,
            withCredentials: true,
            data: query || {},

            success: function(res) {
                complete(null, res)
            },

            error: function(err) {
                complete(err, null);
            }

        });

    };

});