exports.index = {
    get: function (req, res, next) {
        var productApi = require('../api/product');
        var convector = require('../libs/currency').converter;

        res.render('main/index', {
            currency: req.session.currency || 'UAH'
        });
    }
};

exports.auth = {
    get: function (req, res, next) {
        res.render('common/auth');
    },
    post: function (req, res, next) {
        console.log('Auth all right');
        res.redirect(req.session.returnTo);
    }
};

exports.currency = {
    post: function (req, res, next) {
        var currency = req.body.currency;
        if (req.session.passport && req.isAuthenticated && req.isAuthenticated()) {
            var userApi = require('../api/user');
            var uuid = req.session.passport.user;
            userApi.update(uuid, {currency: currency}, function (err, result) {
                if (err) return next(err);
            });
        }
        req.session.currency = currency;
        res.redirect('/');
    }
};