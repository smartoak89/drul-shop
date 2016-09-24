var userAPI = require('../api/user');

exports.main = function (req, res, next) {
    res.render('admin/admin');
};

exports.tovs = function (req, res, next) {
    res.render('admin/tovs');
};
exports.categ = function (req, res, next) {
    res.render('admin/categ');
};
exports.reqs = function (req, res, next) {
    res.render('admin/reqs');
};
exports.stocks = function (req, res, next) {
    res.render('admin/stocks');
};
exports.curr = function (req, res, next) {
    res.render('admin/curr');
};
exports.deliv = function (req, res, next) {
    res.render('admin/deliv');
};
exports.com = function (req, res, next) {
    res.render('admin/com');
};

exports.users = function (req, res, next) {
    res.render('admin/users');

};