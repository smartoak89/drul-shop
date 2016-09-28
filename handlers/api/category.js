var HttpError = require('../../error/index').HttpError;
var msg = require('../../message/ru/category');
var categoryAPI = require('../../api/category');

exports.create = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        categoryAPI.create(value, function (err) {
            if (err) return next(err);
            res.sendMsg(msg.CATEGORY_ADDED);
        })
    });
};

exports.list = function (req, res, next) {
    categoryAPI.list(function (err, result) {
        if (err) return next(err);
        var cat = result.map(function (i) {
            return {
                uuid: i.uuid,
                name: i.name,
                link: i.link,
                subcat: i.subcat
            }
        });
        res.json({data: cat});
    });
};

exports.update = function (req, res, next) {
    if(!isValidCategory(req)) return next( new HttpError(400, 'Invalid Category') );
    var categ = sanitazeCattegory(req);
    categoryAPI.update(req.params.id, categ, function (err) {
        if (err) return next(err);
        res.sendMsg(msg.CATEGORY_UPDATED);
    });
};

exports.add = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        categoryAPI.add(req.params.id, value, function (err) {
            if (err) return next(err);
            res.sendMsg(msg.SUBCATEGORY_UPDATED);
        })
    });
};

exports.remove = function (req, res, next) {
    categoryAPI.remove(req.params.id, req.params.index, function(err, result) {
        if (err) return next(err);
        if(!result) return next(new HttpError(404));
        res.sendMsg(msg.CATEGORY_DELETED);
    })
};

function isValid (req, callback) {
    var v = require('../../libs/validator');

    var data = {
        name: req.body.name,
        link: req.body.link
    };

    var schema = v.joi.object().keys({
        name: v.joi.string().alphanum().min(3).max(20).required(),
        link: v.joi.string().alphanum().min(3).max(20).required()
    });

    v.validate(data, schema, callback);
}