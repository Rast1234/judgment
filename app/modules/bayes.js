var db = require('../db'),
    async = require('async');

/**
 * Method calculate the frequency of occurrence of a word in a documents category
 *
 * @param category - category id
 * @param document - document id
 * @param words - list of words in documents
 * @param done  - callback
 */
exports.train = function(category, document, words, done) {
    var collection,
        frequency = {};

    function amount(word) {
        var lex = word.ana.lex;

        if (!isNaN(parseInt(word.text))) {
            return false;
        }

        if (frequency[lex]) {
            frequency[lex]++;
            return false;
        }

        frequency[lex] = 1;
        return true;
    }

    function refreshrates(word) {

        return function(complete) {

            collection.find({'catId': category, 'word': word}).count(function(err, res){

                if (err) {
                    throw err;
                }

                res = +res.count || 0;

                frequency[word] = frequency[word] + res;
                collection.save({catId: category, word: word, count:frequency[word] }, {safe:true}, complete);
            });

        }

    }

    function indexed(id, complete) {

        function check(col)  {

            col.find({'docId': id}).count(function(err, docs){

                if (err){
                    throw err;
                }

                if (docs) {
                    complete(null, 'indexed');
                    return;
                }

                col.save({docId: id}, {safe:true}, function() {});
                complete(null, 'notindexed');
            });

        }

        db.collection('indexed', check);
    }

    function start(res) {

        indexed(document, function(err, status) {
            var tasks = [];

            if (status === 'indexed') {
                console.log('Document has already been indexed: ', document);
                done(null, true);
                return;
            }

            collection = res;
            words = words.filter(amount);

            for (var key in frequency) {
                tasks.push(refreshrates(key))
            }

            async.series(tasks, done);
        })

    }

    db.collection('frequencies', start);
};

