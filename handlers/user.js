var User = require('../models/user').User;
var uuid = require('uuid');

exports.auth = function (req, res, next) {
    res.end('ok');
};

exports.register = function (req, res, next) {
    var user = {
        email: req.body.email,
        password: req.body.password,
        uuid: uuid.v4()
    };

    //TODO: sanitize and validate

    var user = new User(user);
    user.save(function (err, user) {
        if (err) next(err);
        res.status(200);
        res.json({uuid: user.uuid});
    });
};