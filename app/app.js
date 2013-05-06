var domain = require('domain').create(),
    express = require('express'),
    db = require('./db'),
    config = require('../config').app,
    logger = require('./modules/logger');

var routing = [
    {
        path: '/',
        methods: ['get'],
        controller: './methods/index'
    },
    {
        path: '/frequencies/:category/:offset/:limit',
        methods: ['get'],
        controller: './methods/frequencies'
    },
    {
        path: '/categories',
        methods: ['get'],
        controller: './methods/categories'
    },
    {
        path: '*',
        methods: ['get'],
        controller: './methods/not-found'
    }
];


function start(err, log){
    var app = express();

    if (err) {
        throw err;
    }

    function bind(route) {
        var controller = require(route.controller);

        route.methods.forEach(function(method){
            app[method](route.path, controller[method](route, log));
        });

    }

    function run() {
        app.use('/public', express.static('./public'));
        routing.forEach(bind);

        app.listen(config.port);

        log.log('info', 'Server run at port: ', {port: config.port});
        log.info('info', 'Static folder: ', {path: 'public' });

    }

    domain.run(function() {
        db.init(run);
    });

    domain.on('error', function(err) {
        console.log(err);
        log.error('Application error: ' + JSON.stringify(err));
    });

}

logger.init('app', start);



