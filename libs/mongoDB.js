var MongoClient = require('mongodb').MongoClient
    , conf = require('../conf');

MongoClient.connect(conf.mongoDB.uri, function(err, db) {
    if (err) {
        throw err;
    }
    db.collection('test').save({test: 'test'}, function(err, result) {
        db.collection('test').find().toArray(function(err, result) {
            if (err) {
                throw err;
            }
            console.log(result);
        });
    })
});
