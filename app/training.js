var domain = require('domain').create(),
    async = require('async'),
    rustem = require('rustem'),
    config = require('../config').training,
    db = require('./db'),
    spider = require('./modules/spider'),
    classifier = require('./modules/bayes');

function load(query) {

    function tagging(doc) {

        return function (complete) {
            console.log('Start recognize document: ', doc);

            rustem.recognize(doc.text, domain.intercept(function(res){
                classifier.train(query.search.StatDisputeCategory, doc.id, res, complete);
            }));

        }

    }

    return function(done) {
        console.log('Process category: ', query.search.StatDisputeCategory);

        spider.run(query, domain.intercept(function(res) {
            async.series(res.map(tagging), done);
        }));

    }

}

db.init(function() {
    var start = new Date();

    async.parallel(config.sets.map(load), domain.intercept(function() {
        var diff = new Date() - start;

        console.log('Traning complete: ', diff + 'ms.');
    }));

});

domain.on('error', function(err){
    console.error(err);
});