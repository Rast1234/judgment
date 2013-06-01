var domain = require('domain').create(),
    express = require('express'),
    db = require('../db/client'),
    config = require('../config').app,
    logger = require('../modules/logger'),
    socket = require('./modules/sockets');

var resources = [
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
        path: '/analysis',
        methods: ['post'],
        controller: './methods/analysis'
    },
    {
        path: '/analysis/:id',
        methods: ['get'],
        controller: './methods/analysis'
    },
    {
        path: '*',
        methods: ['options'],
        controller: './modules/cros'

    }
];


function init (err, log){
    var app = express();

    app.use(require('connect').bodyParser());

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
        resources.forEach(bind);

        app.listen(config.port);
        app.use(express.bodyParser());

        log.info('info', 'Server run at port: ', {port: config.port});
        log.info('info', 'Static folder: ', { path: __dirname + '/public' });

    }

    domain.run(run);

    domain.on('error', function(err) {
        console.log(err);
        log.error('Application error: ' + JSON.stringify(err));
    });

};

exports.init = init;

process.on('message', function(message) {

    if (message.sender !== 'root') {
        return;
    }

    logger.init(message.name, init)
});





