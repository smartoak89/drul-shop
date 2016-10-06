var userAPI = require('../../api/user');

exports.index = function (req, res, next) {
    res.render('admin/admin');
};

exports.categories = function (req, res, next) {
    res.render('admin/categ');
};
exports.products = function (req, res, next) {
    res.render('admin/tovs');
};

exports.users = function (req, res, next) {
    res.render('admin/users');
};

exports.request = function (req, res, next) {
    res.render('admin/reqs');
};
exports.stocks = function (req, res, next) {
    res.render('admin/stocks');
};
exports.delivery = function (req, res, next) {
    res.render('admin/deliv');
};
exports.reviews = function (req, res, next) {
    res.render('admin/com');
};
exports.curr = function (req, res, next) {
    res.render('admin/curr');
};