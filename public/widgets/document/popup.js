define(function (require, exports) {
    "use strict";

    require('colorbox');

    var $ = require('jquery');

    exports.create = function (container) {

        function open() {
            $.colorbox({html: '<iframe class="popup" src="' + container.attr('href') + '"/>', width: "810px", height: "600px"});

            return false;
        }

        container.on('click', open);
    };

});