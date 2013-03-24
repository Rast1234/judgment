/* mongodb setup */
var mongo = require('mongodb'),
    async = require('async'),
    domain = require('domain').create(),
    config = require('../config').db,
    server = new mongo.Server(config.host, config.port, {}),
    db = new mongo.Db("test", server, {auto_reconnect: true, w: 'majority'}),
    ready = false,
    buffer = [];

function delay(fn) {
    buffer.push(fn);
}

function resume() {
    async.parallel(buffer);  
}

function init (done) {    
    ready && done(null, true);
    
    db.open(function(err){
        var usr = config.db.user, 
            pwd = config.db.pass;
        
        if(err) { 
            done(err, null);
            return;
        }
        
        if (!usr || !pwd) {
            done('Undefined Database user or password', null);
            return;
        }
    
        db.authenticate(usr, pwd, function(err, res) {
            
            if (err) {
                done(err, null);
                return;
            }
            
            ready = true;
            done(null, true);
        });
        
    });   
}

exports.update = function(category, document, complete) {
    
    if (!ready) {
        
        delay(function(done) {
            exports['update'].call(this, category, document, complete);
            done(null, true);
        });
        
        return;
    }
    
    console.log(category);
     
}


domain.run(function() {
    init(resume);    
});

domain.on('error', function(err) {
    console.error('Database error: ', err);  
});
