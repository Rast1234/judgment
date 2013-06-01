define(function (require, exports) {
    "use strict";

    var socket = require('socket.io'),
        bus = require('bus');

    exports.create = function () {
        var io = socket.connect('http://localhost:3001'),
            session = 'session-' + Math.floor(Math.random(1,2) * 10000);

        function emit(res) {
            console.log(res);
            bus.emit(res.type, res.data);
        }

        bus.emit('current:session', session);
        io.emit('register', { session: session });

        io.on('events', emit);
    };

});