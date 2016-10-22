var Promise = require('bluebird');
var HttpError = require('../error').HttpError;
var conf = require('../conf');
var log = require('../libs/logger')(module);
var path = require('path');

exports.app = {
    get: function (req, res, next) {
        res.sendFile(path.join(conf.rootDir, '/app/index.html'));
    }
};

// exports.index = {
//     get: function (req, res, next) {
//         var productAPI = require('../api/product')(req.user);
//         productAPI.list(function (err, products) {
//             if (err) return next(err);
//             console.log('products', products);
//             res.render('main/index', {
//                 data: {
//                     products: products
//                 }
//             });
//         })
//     },
//     filter: function (req, res, next) {
//         var productAPI = require('../api/product')(req.user);
//         productAPI.list(function (err, products) {
//             if (err) return next(err);
//             console.log('products', products);
//             res.render('main/filter', {
//                 data: {
//                     products: products
//                 }
//             });
//         });
//     },
//     search: function (req, res, next) {
//         var productAPI = require('../api/product')(req.user);
//         productAPI.filter(req, function (err, result) {
//             if (err) return next(err);
//             res.render('main/filter', {data: {
//                 products: result
//             }});
//         })
//     }
// };
//
// exports.auth = {
//     get: function (req, res, next) {
//         res.render('common/auth');
//     },
//     post: function (req, res, next) {
//         console.log('Auth all right');
//         res.redirect(req.session.returnTo);
//     }
// };
//
// exports.currency = {
//     post: function (req, res, next) {
//         var currency = req.body.currency;
//         if (req.session.passport && req.isAuthenticated && req.isAuthenticated()) {
//             var userApi = require('../api/user');
//             var uuid = req.session.passport.user;
//             userApi.update(uuid, {currency: currency}, function (err, result) {
//                 if (err) return next(err);
//             });
//         }
//         req.session.currency = currency;
//         res.redirect('/');
//     }
// };