exports.index = {
    get: function (req, res, next) {
        var productAPI = require('../api/product');
        var convector = require('../libs/currency').converter;
        var userAPI = require('../api/user');

        console.log(req.query);
        // if (req.query) {
        //     productAPI.findAll(req.query, function (err, result) {
        //         if (err) return next(err);
        //         res.json(result);
        //     });
        // }
        userAPI.currentAcriveUser(req, function (err, user) {
            if (err) return next(err);
            var data = {
                //currency: user.currency || req.session.currency || 'UAH'
            };
            res.render('main/index', data);
        });
    },
    filter: function (req, res, next) {
        res.render('main/filter');
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