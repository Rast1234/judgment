var async = require('async'),
    config = require('./config'),
    child = require('child_process');

(function run() {

    var task = [
        {
            'name': 'db',
            'path' : '/db/client.js'
        },
        {
            'name': 'webapi',
            'path' : '/webapi/server.js'
        }
        /*{
            'name': 'services',
            'path' : '/services/scheduler.js'
        }*/
    ];

    function run(instance) {

        return function(done) {
            var p = child.fork(__dirname + instance.path);

            p.send({
                sender: 'root',
                action: 'init'
            });

            done(null,  {
                name: instance,
                gate: p
            });

        }
    }

    function complete(err, res) {

        if (err) {
            throw err;
        }

        console.log('Application pool started: ', + res);
    }

    async.series(task.map(run), complete);
}());



