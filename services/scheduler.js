/**
 * Планировщик сервисов
 */

var async = require('async'),
    CronJob = require('cron').CronJob,
    logger = require('../modules/logger');

var schedule = [
    {
        'name': 'training',
        'time': '10 * * * * *'
    }
];

function init (err, logger) {

    if (err) {
        throw err;
    }

    function subscribe(job) {

        return function(done) {
            var worker =  require(__dirname + '/workers/' + job.name);

            function run() {
                worker.run(logger);
            }

            var cronJob = new CronJob(job.time, run, null, true);

            cronJob.start();

            logger.log('info', 'Service: ' + job.name + ' added to the schedule');
            done(null, cronJob);
        }

    }

    function complete(err, res) {

        if (err) {
            throw err;
        }

        logger.log('info', 'All services started');
    }

    async.series(schedule.map(subscribe), complete);
}

process.on('message', function(message) {

    if (message.sender !== 'root') {
        return;
    }

    logger.init(message.name, init)
});
