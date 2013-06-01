var db = require('../db/client'),
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


exports.classify = function(category, words, done) {
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

    function process(frequencies) {

        return function(word, next) {

            async.series({

                'in': function(next) {
                    frequencies.find({'catId': category, 'word': word.text}).count(next);
                },

                'out': function(next) {
                    frequencies.find({'catId': {"$ne": category }, 'word': word.text}).count(next);
                },

                'allin': function(next) {
                    frequencies.find({'catId': category }).count(next);
                },

                'allout': function(next) {
                    frequencies.find({'catId': {"$ne": category }}).count(next);
                }

            }, function(err, res) {
                res.allin += frequency[word.ana.lex];
                res.in += frequency[word.ana.lex];
                res.out = res.out || 1;

                var pw = res.in  / res.allin,
                    pnw = res.out / res.allout,
                    plw = 1 - Math.pow(1 - pw, words.length),
                    pnlw = 1 - Math.pow(1 - pnw, words.length),
                    w = Math.log(plw/pnlw) / Math.log(10);

                next(null, {
                    word: word,
                    stats: res,
                    price: w
                });

            });

        };

    }

    function complete(err, res) {

        var numerator = 0,
            denominator = 0,
            price;

        res = res.filter(function(obj) {
            return isFinite(obj.price) || !!obj.price;
        });

        for (var i = 0, max = res.length; i<max; i++) {
            price = isNaN(res[i].price) || !res[i].price ? 1 : res[i].price;

            numerator += price * res[i].stats.in;
            denominator += res[i].stats.in;
        }

        done(null, {category: category, result: numerator/denominator, err: err, res: res});
    }

    function start(frequencies) {
        words = words.filter(amount);
        async.map(words, process(frequencies), complete);
    }

    db.collection('frequencies', start);
};
