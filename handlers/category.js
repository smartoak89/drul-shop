var HttpError = require('../error/index').HttpError;
var categoryAPI = require('../api/category');
var msg = require('../error/message.ru');

exports.create = function (req, res, next) {
    if(!isValidCategory(req)) return next( new HttpError(400, 'Invalid Category') );
    var category = sanitazeCattegory(req);
    categoryAPI.create(category, function (err) {
        if (err) return next(err);
        res.sendMsg(msg.CATEGORY_ADDED);
    })
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
        res.json(cat);
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
    if(!isValidCategory(req)) return next( new HttpError(400, 'Invalid Category') );
    var categ = sanitazeCattegory(req);
    categoryAPI.add(req.params.id, categ, function (err) {
        if (err) return next(err);
        res.sendMsg(msg.SUBCATEGORY_UPDATED);
    })
};

exports.remove = function (req, res, next) {
    categoryAPI.remove(req.params.id, req.params.index, function(err, result) {
        if (err) return next(err);
        if(!result) return next(new HttpError(404));
        res.sendMsg(msg.CATEGORY_DELETED);
    })
};

function sanitazeCattegory (req) {
    //TODO: sanitaze
    return {
        name: req.body.name,
        link: req.body.link
    }
}

function isValidCategory (req) {
    //TODO: validation
    return true;
}