module.exports = function (req, res, next) {
    if (req.session.passport) {
        var userAPI = require('../api/user');
        userAPI.findOne({uuid: req.session.passport.user}, function(err, user) {
            if (err) return next(err);
            if (!user) return next();
            req.user = user;
            return next();
        })
    } else {
        req.user = {
            permission: 'member',
            currency: req.session.currency || 'UAH'
        };
        next();
    }
};