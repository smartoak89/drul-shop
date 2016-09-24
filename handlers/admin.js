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

exports.listOfUsers = function (req, res, next) {
    userAPI.listOfUsers(function (err, data) {
        if (err) return next(err);
        var listOfUsers = data.map(function (a, b, d) {
           return {
               uuid: a.uuid,
               email: a.email,
           }
        });
        res.status(200);
        res.json({data: listOfUsers})
    });

};

exports.addUser = function (req, res, next) {
    var user = {
        email: req.body.email
    };
    userAPI.addUser(user, function (err, user) {
        if (err) return next(err);
        res.status(200);
        res.json(user.uuid);
    });

};
exports.dropUsers = function (req, res, next) {
    userAPI.dropUsers(null, function (err, result) {
        if (err) return next(err);
        res.status(200);
        res.json(result);
    });

};