var db = require('../libs/datastore')('user');
var HttpError = require('../error').HttpError;

module.exports = {
    create: function (data, callback) {
        db.create(data, callback)
    },
    list: function (callback) {
        db.list(callback);
    },
    update: function (id, data, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(new HttpError(404, 'User Not Found'));
            for (var k in data) {
                if (typeof data[k] !== 'undefined') {
                    result[k] = data[k];
                }
            }
            console.log('User data for update => ', JSON.stringify(data));
            db.update(result.uuid, result, callback);
        })
    },
    remove: function (id, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if (!result) return callback(404);
            db.remove(id, callback);
        });
    },
    find: function (id, callback) {
        db.find(id, callback);
    },
    auth: function (email, password, callback) {
        db.findOne({email: email}, function (err, result) {
            console.log('email', email);
            console.log('password', password);
            if (err) return callback(err);
            if (!result) return callback(new HttpError(404, 'User Not Found'));
            if (!result.checkPassword(password)) return callback();
            console.log('Got user =>', result);
            return callback (null, result);
        });
    },
    findOne: function (data, callback) {
        db.findOne (data, callback);
    }
};

// var User = require('../models/user').User;

// exports.listUsers = function (callback) {
//     User.find({}, function (err, data) {
//         if (err) return callback(err);
//         callback(null, data);
//     })
// };

//
// exports.read = function (id, callback) {
//     User.findOne({uuid: id}, function(err, user) {
//         if (err) return callback(err);
//         if (!user) {
//             var HttpError = require('../error').HttpError;
//             return callback(new HttpError(404, "User Not Found"))
//         }
//         console.log('finded user', JSON.stringify(user));
//         callback(null, user);
//     })
// };
//
// exports.delete = function (id, callback) {
//     User.remove({uuid: id}, function(err, affected) {
//         if (err) return callback(err);
//         callback(null, affected.result);
//     })
// };
//
// exports.drop= function (user, callback) {
//     User.remove({}, function(err, affected) {
//         if (err) return callback(err);
//         callback(null, affected.result);
//     })
// };

