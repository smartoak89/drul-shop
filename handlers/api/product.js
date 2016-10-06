var productApi = require('../../api/product');
var msg = require('../../message/ru/product');
var log = require('../../libs/logger')(module);
var HttpError = require('../../error').HttpError;
var Promise = require('bluebird');

exports.create = function (req, res, next) {
    isValid(req, function (err, value) {
        log.log('gotVal %', value);
        if (err) return res.sendMsg(err, true, 400);
        productApi.create(value, function (err) {
            if (err) return next(err);
            res.sendMsg(msg.CREATED);
        })
    });
};

exports.list = function (req, res, next) {
    productApi.list(function (err, result) {
        if (err) return next(err);

        Promise.map(result, view).then(function (data) {
            res.json({data: result});
        }, function (err) {
            next(err);
        });
    });
};

exports.update = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        productApi.update(req.params.id, value, function (err) {
            if (err) return next(err);
            res.sendMsg(msg.UPDATED);
        });
    });
};

exports.remove = function (req, res, next) {
    productApi.remove(req.params.id, function(err) {
        if (err) return next(err);
        res.sendMsg(msg.DELETED);
    })
};

var fileAPI = require('../../api/file');
var view = Promise.promisify(function (prod, i, c, callback) {
    fileAPI.findAll({parent: prod.uuid}, function (err, gall) {
        if (err) return callback(new HttpError(500));
        prod.gallery = gall;
        callback();
    });
});

function viewData (data) {
    var res = {
        uuid: data.uuid,
        name: data.name,
        article: data.article,
        description: data.description,
        category: data.category,
        count: data.count,
        color: data.color,
        size: data.size,
        price: data.price,
        gallery: data.gallery,
        old_price: data.old_price
    };
    return res;
}

function isValid (req, callback) {
    var v = require('../../libs/validator');

    var data = {
        name: req.body.name,
        article: req.body.article,
        description: req.body.description,
        category: req.body.category,
        count: req.body.count,
        color: req.body.color,
        size: req.body.size,
        price: req.body.price,
        old_price: req.body.old_price,

    };

    var schema = v.joi.object().keys({
        name: v.joi.string().min(4).max(50).required(),
        article: v.joi.string().token().max(50),
        description: v.joi.string().max(250),
        category: v.joi.string().max(50),
        count: v.joi.string().max(3),
        color: v.joi.array().items(v.joi.string()),
        size: v.joi.array().items(v.joi.string()),
        price: v.joi.number(),
        old_price: v.joi.number(),
    });

    v.validate(data, schema, callback);
}

//TODO: product should be with unique article and name