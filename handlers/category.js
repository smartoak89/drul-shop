var categoryAPI = require('../api/category')();

exports.get = function (req, res, next) {
    categoryAPI.list(function (err, list) {
        if (err) return next(err);
        console.log('Got category list =>', list);
        res.end('ok');
    });
};