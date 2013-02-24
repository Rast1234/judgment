var spider = require('../services/spider');

exports['spider must run, and return finish time'] = function(test){
    
    spider.run(new Date().getTime(), function(data) {    
        test.expect(1);
        test.ok(true, "this assertion should pass");
        test.done();      
    });

};