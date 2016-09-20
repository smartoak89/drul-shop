var program = require('commander');
var async = require('async');
var crypto = require('crypto');
var config = require('../config');
var mongoclient = require('mongodb').MongoClient;
var db;

program
    .version(config.taracotjs)
    .option('-m, --mongo [url]', 'Specify MongoDB connect URL')
    .option('-s, --silent', 'Don\'t ask anything (perform silently)')
    .option('-k, --keepstats', 'Keep statistics')
    .parse(process.argv);

var mongo_url = program.mongo || config.mongo.url;

var uninstall = function() {
    mongoclient.connect(mongo_url, config.mongo_options, function(err, _db) {
        if (err) {
            console.log("\nCould not connect to the MongoDB. Please check config.js");
            console.log(err);
            process.exit(1);
        }
        console.log("\nConnected to MongoDB");
        db = _db;
        db.collectionNames(function(err, collections) {
            if (!err) {
                if (collections && collections.length) {
                    console.log("\nDropping all collections in database\n");
                    async.eachSeries(collections, function(collection, e_callback) {
                        var name = collection.name.replace(/^(\w+)\./, '');
                        if (!name.match(/^system\./)) {
                            if (name == 'indexes') return e_callback();
                            if (name == 'statistics' && program.keepstats) {
                                console.log(" [*] skipping statistics, --keepstats is in effect");
                                return e_callback();
                            } else {
                                console.log(" [*] dropping: " + name);
                                db.collection(name).drop(function(err) {
                                    if (err) return e_callback("\n [ERROR] cannot drop " + name + ': ' + err);
                                    console.log(" [*] " + name + " has been dropped");
                                    e_callback();
                                });
                            }
                        } else {
                            e_callback();
                        }
                    }, function(err) {
                        if (err) {
                            console.log("\n[ERROR]: " + err);
                        } else {
                            console.log("\nAll done");
                        }
                        process.exit(0);
                    });
                }
            }
        });
    });
};
console.log("This script clean up the current database. All data will be lost.\n");
console.log("Database connection is required.");
console.log("Current MongoDB URL: " + mongo_url + "\n");
if (program.silent) {
    uninstall();
} else {
    program.confirm('Continue? ', function(ok) {
        if (ok) {
            uninstall();
        } else {
            process.exit(0);
        }
    });
}
