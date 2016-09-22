var User = require('../models/user').Add;

exports.auth = function (req, res, next) {
    res.end('ok');
};

exports.register = function (req, res, next) {
    var user = {
        email: req.body.email,
        password: req.body.pass
    };

    //TODO: sanitize and validate

    var user = new User(user);
    user.save(function (err, user) {
        if (err) next(err);
        console.log('savedUser', user);
    });
};