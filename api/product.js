var db = require('../libs/datastore')('product');
var HttpError = require('../error').HttpError;
var Promise = require('bluebird');

function Product (user) {
    this.user = user;
}

Product.prototype = {
    create: function (data, callback) {
        db.create(data, callback)
    },
    list: function (callback) {
        var self = this;
        db.list(function (err, result) {
            if (err) return callback(err);
            configureProduct(self.user, result).then(function () {
                callback(null, result);
            }).catch(function (err) {
                callback(err);
            });
        });
    },
    update: function (id, data, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(new HttpError(404, 'Product Not Found'));
            for (var k in data) {
                if (typeof data[k] !== 'undefined') {
                    result[k] = data[k];
                }
            }
            db.update(result.uuid, result, callback);
        })
    },
    remove: function (id, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(new HttpError(404, 'Product Not Found'));
            db.remove(id, callback);
        });
    },
    findOne: function (document, callback) {
        var self = this;
        db.findOne(document, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(new HttpError(404, 'Product Not Found'));
            configureProduct(self.user, [result]).then(function () {
                callback(null, result);
            }).catch(function (err) {
                callback(err);
            });
        })
    },
    findAll: function (document, callback) {
        db.findAll(document, callback);
    }
};

var configureProduct = Promise.promisify(function (user, list, callback) {
    var fileAPI = require('./file');
    var converter = require('../libs/currency').converter;
    converter(list, user.currency, function (err, result) {
        if (err) return calblack(err);

        return Promise.map(list, Promise.promisify(function (product, i, c, cb) {
            fileAPI.findAll({parent: product.uuid}, function (err, gall) {
                if (err) return callback(500);
                product.gallery = gall;
                cb();
            });
        })).then(function () {
            callback();
        });
    });
});

module.exports = function (user) {
    return new Product(user);
};
