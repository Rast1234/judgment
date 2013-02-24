/**
 *  Run all services 
 *
 */
var async = require('async'),
    config = require('../config.js');


function process(data) {
    
    return function(next){
        
        try {
            require('./' + data.id).run(data, next);
        } catch (e) {
            next(e, null);
        }
        
    }
    
}

function complete(err, res){ 
    console.log('all services complete', res);
}

async.parallel(config.services.map(process), complete);