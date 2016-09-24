var User = require('../models/user').User;

exports.listUsers = function (callback) {
    User.find({}, function (err, data) {
        if (err) return callback(err);
        callback(null, data);
    })
};