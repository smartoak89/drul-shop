var productApi = require('../../api/product');
var msg = require('../../message/ru/product');
var HttpError = require('../../error').HttpError;

exports.create = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        userAPI.findOne({email: value.email}, function(err, result) {
            if (err) return next(err);
            if (result) return res.sendMsg(msg.EMAIL_EXISTS, true, 400)
            userAPI.create(value, function (err, user) {
                if (err) return next(err);
                if (!user) return res.sendMsg(msg.REGISTERED_ERROR, true, 400);
                res.sendMsg(msg.REGISTERED_SUCCESS);
            })
        });
    });
};exports.create = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        userAPI.findOne({email: value.email}, function(err, result) {
            if (err) return next(err);
            if (result) return res.sendMsg(msg.EMAIL_EXISTS, true, 400)
            userAPI.create(value, function (err, user) {
                if (err) return next(err);
                if (!user) return res.sendMsg(msg.REGISTERED_ERROR, true, 400);
                res.sendMsg(msg.REGISTERED_SUCCESS);
            })
        });
    });
};