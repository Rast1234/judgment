/**
 * Module tokenize stem and pos-tagging text
 */
var natural = require('natural'),
    fs = require('fs'),
    classifier, workpath;

function train(tokens, category, next) {

    exports['prepare'](function(err, res) {

        if (err) {
            return;
        }

        classifier = res;
        classifier.addDocument(tokens, category);

        next(null, true);
    });

}

exports.prepare = function(path, next) {
    workpath = path;

    if (classifier) {
        next(null, classifier);
        return;
    }

    if(!fs.existsSync(path)) {
        next(null, new natural.BayesClassifier());
        return;
    }

    natural.BayesClassifier.load(path, null, next);

};

exports.process = function(id, category, text, next) {
    natural.PorterStemmerRu.attach();
    train(text.tokenizeAndStem(), category, next);
};

exports.classify = function(criterion, document, next) {
    next(null, classifier.classify(document));
};

exports.capture = function(next) {
    classifier.save(workpath, next);
};