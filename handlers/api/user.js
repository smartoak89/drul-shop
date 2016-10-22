var userAPI = require('../../api/user');
var msg = require('../../message/ru/user');
var HttpError = require('../../error').HttpError;

exports.register = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        userAPI.findOne({email: value.email}, function(err, result) {
            if (err) return next(err);
            if (result) return res.sendMsg(msg.EMAIL_EXISTS, true, 400);
            userAPI.create(value, function (err, user) {
                if (err) return next(err);
                if (!user) return res.sendMsg(msg.REGISTERED_ERROR, true, 400);
                res.json({uuid: user.uuid});
            })
        });
    });
};

exports.list = function (req, res, next) {
    userAPI.list(function (err, result) {
        if (err) return next(err);
        var list = result.map(function (i) {
            return viewData(i);
        });
        res.json({data: list});
    });
};

exports.update = function (req, res, next) {
    isValidUpdate(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        userAPI.update(req.params.id, value, function (err) {
            if (err) return next(err);
            res.sendMsg(msg.UPDATED_SUCCESS);
        });
    });
};

exports.remove = function (req, res, next) {
    userAPI.remove(req.params.id, function(err) {
        if (err) return next(err);
        res.sendMsg(msg.DELETED);
    })
};

exports.find = function (req, res, next) {
    userAPI.find(req.params.id, function (err, result) {
        if (err) return next(err);
        if (!result) return next(new HttpError(404, 'User Not Found'));
        var data = viewData(result);
        res.json(data);
    })
};

exports.auth = function (req, res, next) {
    isValid(req, function (err) {
        if (err) return res.sendMsg(err, true, 400);
        userAPI.auth(req.body.email, req.body.password, function (err, user) {
            if (err) return next(err);
            if (!user) return res.sendMsg(msg.AUTH_ERROR, true, 400);
            req.session.user = {
                uuid: user.uuid,
                email: user.email
            };
            res.json({user: user});
        })
    });
};

function viewData (data) {
    var res = {
        uuid: data.uuid,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        created: data.created,
        currency: data.currency
    };
    return data;
}

function isValidUpdate (req, callback) {
    var v = require('../../libs/validator');

    var data = {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        currency: req.body.currency
    };

    var schema = v.joi.object().keys({
        email: v.joi.string().email(),
        first_name: v.joi.string(),
        last_name: v.joi.string(),
        phone: v.joi.number().min(11),
        currency: v.joi.string().max(3)
    });

    v.validate(data, schema, callback);
}

function isValid (req, callback) {
    var v = require('../../libs/validator');

    var data = {
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };

    var schema = v.joi.object().keys({
        email: v.joi.string().email().required(),
        password: v.joi.string().regex(/^[a-zA-Z0-9-_]{4,30}$/).required(),
        phone: v.joi.number(),
        firstname: v.joi.string().max(20),
        lastname: v.joi.string().max(20)
    });

    v.validate(data, schema, callback);
}
