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
    add: function (id, data, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            result.subcat.push(data);
            db.update(result.uuid, result, callback);
        })
    },
    remove: function (id, index, callback) {
        db.find(id, function (err, result) {
            if (err) return callback(err);
            if(index) {
                result.subcat.splice(index, 1);
                db.update(id, result, callback);
            } else {
                db.remove(id, callback);
            }
        });
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

