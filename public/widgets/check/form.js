define(function (require, exports) {
    'use strict';

    require('mustache');

    var transport = require('modules/transport'),
        bus = require('bus');

    exports.create = function (container) {

        function complete(err, res) {

            if (err) {
                bus.emit('app:error', err);
                return;
            }

            bus.emit('document:checked', res);
        }

        function search() {

            function send(session) {

                var data = {
                    category: container.find('[name="category"]').val(),
                    text: container.find('[name="text"]').val(),
                    session: session
                }

                transport.send('post', 'analysis', JSON.stringify(data), complete);
            }

            bus.reemit('current:session', send);
            return false;
        }


        container.on('click', '.btn', search);
    };

});