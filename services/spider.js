/**
 *  Spider, parse site: ras.aribitr.ru 
 *          selects all court decisions and saves them to the database in a normalized form
 * 
 *  Run as serveice, in crontab
 */
var http = require('http'),
    bus = require('../modules/bus'),
    async = require('async'),
    dm = require('domain').create(),
    stringjs = require('string'), host;

function send(opts, data, next) {
    var page = '';
        
    var req = http.request(opts, function(res) {
        res.setEncoding('utf8');
        
        res.on('data', function (chunk) {
            page += chunk;        });
        
        res.on('end', function() {
            next(null, page);
        });
        
    });
    
    data && req.write(data);
    req.end(); 
}

function search(data, finish) { 
    var opts = {
        host: host,
        path: '/Ras/Search',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'X-Requested-With': 'XMLHttpRequest'
        }
    }; 

    send(opts, data, function(err, res) {
        finish(null, JSON.parse(res.toString()));      
    });
         
}

function process(item) {
    var opts = {
        host: host,
        path: '/Ras/HtmlDocument/' + item.Id,
        method: 'GET'
    }; 
    
    return function(next) {

        send(opts, null, function(err, res) {
            var document = {info: item, text: stringjs(res).stripTags().s}
            
            bus.emit('spider:document', document);
            next(null, document);      
        });
        
    };
    
}

function done(documents){
    bus.emit('spider:complete', documents.length);
}

exports.run = function(cfg, done) {
    host = cfg.url;

    function prepare(data, cat) {
        data.DateFrom = new Date(Date.now() - cfg.offset).toISOString();
        data.StatDisputeCategory = cat && cat.toString();
        return JSON.stringify(data);
    }
 
    function exec(cat) {
   
        return function(next) {
            var query = prepare(cfg.search, cat);
        
            search(query, function(err, res) {
                
                if (err) {
                    next(err, null);
                    return;
                }

                if (!res.Success) {
                    next(null, []); 
                    return;
                }
               
                async.parallel(res.Result.Items.map(process), next);
            });
            
        };  
    
    }
 
    dm.run(function() {
        
        var tasks = {},
            cts = cfg.categories;
        
        cts.forEach(function(ct) {
            tasks[ct] = exec(ct);     
        });
        
        async.parallel(tasks, done);
    }); 
    
          
    dm.on('error', function(err) {
        bus.emit('app:error', 'domain services/spider: ' + err);  
        done(err, null);
    });
    
};
