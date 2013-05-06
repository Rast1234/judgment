/**
 * шина событий
 */
define(function (require) {
    "use strict";

    var events = require('events'),
        bus = new events.EventEmitter();

    bus.setMaxListeners(100);

    var emit = bus.emit,
        last = {};

    bus.emit = function () {
        var args = Array.prototype.slice.call(arguments),
            type;

        if (args[0] !== 'newListener') {

            if (console && typeof console.log === 'function') {
                console.log.apply(console, args);
            }

        }

        emit.apply(bus, args);
        type = args.shift();
        last[type] = args;

        return bus;
    };

    bus.reemit = function (type, callback) {
        if (last[type] === undefined) {
            return bus;
        }

        callback.apply(this, last[type]);

        return bus;
    }

    return bus;
});