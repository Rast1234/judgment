/**
 *  Remove token by dicts 
 */

var async = require('async'), 
    path = require('path'),
    voca = [
        'nbsp',
        'не',
        'и',
        'а'
    ];

function check(token, next) {
    next(voca.indexOf(token) < 0);
}

exports.exec = function(cat, doc, done){
    async.filterSeries(doc.tokens, check, function(res) {
        doc.tokens = res;
        done(null, cat, doc); 
    });
    
}