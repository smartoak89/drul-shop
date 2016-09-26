var HttpError = require('../error/index').HttpError;
var categoryAPI = require('../api/category')();

exports.get = function (req, res, next) {
    categoryAPI.list(function (err, list) {
        if (err) return next(err);
        console.log('Got category list =>', list);
        res.end('ok');
    });
};

exports.create = function (req, res, next) {
    if(!isValidCategory(req)) return next( new HttpError(400, 'Invalid Category') );
    res.sendMsg('All ok', true, 400);
    // categoryAPI.add(req.body.id, req.body.parent, function (err, id) {
    //     if (err) return next(err);
    //     req.flash({message: 'allOk'});
    // })
};

function isValidCategory (req) {
    //TODO: validation and sanitaze
    return true;
}