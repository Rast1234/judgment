define(function (require, exports) {
    "use strict";

    require('colorbox');

    var $ = require('jquery'),
        bus = require('bus'),
        template = require('text!templates/results.html');

    exports.create = function () {

        function prepare(obj) {
            obj.catName = $('#categories option[value="' + obj.cat +'"]').text();
            return obj;
        }

        function sort(a, b) {
            return b.data.result - a.data.result;
        }

        function open(data) {
            $.colorbox({html: Mustache.to_html(template, { results: data.results.sort(sort).map(prepare) }) });

            return false;
        }

        bus.on('analysis:complete', open);
    };

});