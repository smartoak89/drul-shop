
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

exports.listUsers = function (req, res, next) {
    var userAPI = require('../api/user');
    userAPI.listUsers(function (err, data) {
        if (err) next(err);
        var listOfUsers = data.map(function (a, b, d) {
           return {
               email: a.email
           }
        });
        res.status(200);
        res.json({data: listOfUsers})
    });

};