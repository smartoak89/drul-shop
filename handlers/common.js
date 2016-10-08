var Promise = require('bluebird');
var HttpError = require('../error').HttpError;

exports.index = {
    get: function (req, res, next) {
        console.log('currentUser => ', req.user);
        var productApi = require('../api/product')(req.user);

        productApi.list(function (err, products) {
            if (err) return next(err);

            res.render('main/index', {
                data: {
                    products: products
                }
            });
        })
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

var productsList = Promise.promisify(function (callback) {
    var productAPI = require('../api/product');
    productAPI.list(function (err, data) {
        if (err) return callback(err);
        callback(null, data);
    });
});
// function productsList () {
//     var Promise = require('bluebird');
//     new Promise(function ())
//     var productAPI = require('../api/product');
//
//     productAPI.list(function (err, data) {
//         if (err) return next(err);
//         res.json({data: data});
//     });
// }