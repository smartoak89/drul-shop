var HttpError = require('../error/index').HttpError;
var categoryAPI = require('../api/category')();

exports.get = function (req, res, next) {
    categoryAPI.list(function (err, list) {
        if (err) return next(err);
        var cat = sanitazeCattegory(list);
        res.json(cat);
    });
};

exports.create = function (req, res, next) {
    if(!isValidCategory(req)) return next( new HttpError(400, 'Invalid Category') );
    categoryAPI.add(req.body.name, req.body.parent, function (err, result) {
        if (err) return next(err);
        if (!result) return next(500);
        res.sendMsg('Category ' + result.name + ' was added');
    })
};
function sanitazeCattegory (data) {
    //TODO: sanitaze
    return data;
}
function isValidCategory (req) {
    //TODO: validation
    return true;
}