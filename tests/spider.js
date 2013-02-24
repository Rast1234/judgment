var spider = require('../services/spider');

exports['spider must run, should return an indication that all documents are saved'] = function(test){
    var data = {
        "url": "ras.arbitr.ru",
        "search": {"Page":1,"Count":2,"GroupByCase":false,"DateFrom":"2000-01-01T00:00:00","DateTo":"2030-01-01T23:59:59","Sides":[],"Judges":[],"Cases":[],"Text":"","InstanceType":"-1"} 
    }
    
    spider.run(data, function(err, res) {
        
        test.ok(!err);    
        test.ok(res && res.length && res.length > 0, 'not found any documents');
        
        res.forEach(function(status) {
            test.ok(status, 'document not save');
        });
        
        test.done();
    });

};