/**
 *  Naive Bayes classifier 
 *  http://download.yandex.ru/company/experience/rcdl2008/rcdl_sites_autoclassification.pdf
 */
var async = require('async'),
    utils = require('../../utils/text_analyzer'),
    ct, result;

function prepare(token) {  
    var ret = {};
    
    if (typeof token !== 'object') {
        ret['t'] = token;
    }
    
    // LATEX Standart
    ret['neg N_w'] = token['neg N_w'] || 0; 
    ret['N_w'] = token['N_w'] || 0; 
    ret['neg N_tot'] = token['neg N_tot'] || 0; 
    ret['N_tot'] = token['N_tot'] || 0; 
    ret['W^l_w'] = token['W^l_w'] || 0;   
    
    return ret;
}

function process(token){
    // TODO get ct value form db
    return function(next) {
        token['N_w'] = utils.sameWordCount(result, token);
        token['N_tot'] = token['N_w'] + 0;
        
        next(null, token);
    };   
}

exports.exec = function(category, doc, next) {
    result = doc.tokens.map(prepare);
    ct = category;
    
    async.parallel(result.map(process), function(err, res) {
        result = undefined;    
        next(null, category, res);
    });
}
