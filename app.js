console.log('app run');

var bus = require('./modules/bus'),
    db = require('./modules/db'),
    config = require('./config'),
    spider = require('./services/spider');


function run() {
    spider.run(config.services.spider, next);
}

function next() {
    setTimeout(run, 3000);
}


bus.on('document:loaded', function(doc) {
    db.update(doc);
});

run();