define(['exports', 'jquery', 'bus', 'async'], function (exports, $, bus, async)  {

    function init() {
        async.parallel($('[data-link]').map(render), complete);
    }

    function render(i, node) {

        return function(next) {
            var link = node.getAttribute('data-link'),
                args = node.getAttribute('data-args') || '';

            args = args.split(',');

            require([link], function(widget) {
                args.unshift($(node));
                widget.create.apply(this, args);
                next(null, { 'link': link, 'args': args });
            });

        }

    }

    function complete(err, res) {

        if (err) {
            throw err;
        }

        bus.emit('ready', res);
    }

    exports.init = init;
});