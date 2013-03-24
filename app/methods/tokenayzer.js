var nutural = require('natural');

exports.exec = function(cat, doc, done){
    nutural.PorterStemmerRu.attach(); 
    doc.tokens =  doc.text.tokenizeAndStem();
    done(null, cat, doc); 
}