/**
 *  Run all services 
 *
 */
 

var async = require('async'),
    config = require('../config.json');


function run(data) {
    
    try {
        require('./' + data.id).run(data);
    } catch (e) {
        console.warn('Service ' + data.id + ' does not provide method run');
    }
    
}

function complete(){ 
    console.log('all services starts');
}

async.each(config.services, run, complete);