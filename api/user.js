var User = require('../models/user').User;
var uuid = require('uuid');

exports.listUsers = function (callback) {
    User.find({}, function (err, data) {
        if (err) return callback(err);
        callback(null, data);
    })
};

exports.create = function (user, callback) {
    var user = new User(user);
    user.uuid = uuid.v4();
    user.save(user, function(err, user) {
        if (err) return callback(err);
        callback(null, user);
    })
};

exports.delete = function (id, callback) {
    User.remove({uuid: id}, function(err, affected) {
        if (err) return callback(err);
        callback(null, affected.result);
    })
};

exports.drop= function (user, callback) {
    User.remove({}, function(err, affected) {
        if (err) return callback(err);
        callback(null, affected.result);
    })
};

