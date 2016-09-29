var userAPI = require('../../api/user');
var msg = require('../../message/ru/user');

exports.register = function (req, res, next) {
    isValid(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        userAPI.create(value, function (err, user) {
            if (err) return next(err);
            if (!user) return res.sendMsg(msg.REGISTERED_ERROR, true, 400);
            res.sendMsg(msg.REGISTERED_SUCCESS);
        })
    });
};

exports.list = function (req, res, next) {
    userAPI.list(function (err, result) {
        if (err) return next(err);
        var list = result.map(function (i) {
            return {
                uuid: i.uuid,
                email: i.email,
                created: i.created
            }
        });
        res.json({data: list});
    });
};

exports.update = function (req, res, next) {
    isValidUpdate(req, function (err, value) {
        if (err) return res.sendMsg(err, true, 400);
        userAPI.update(req.params.id, value, function (err) {
            if (err) return next(err);
            res.sendMsg(msg.UPDATED_SUCCESS);
        });
    });
};

function isValidUpdate (req, callback) {
    var v = require('../../libs/validator');

    var data = {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone
    };

    var schema = v.joi.object().keys({
        email: v.joi.string().email(),
        first_name: v.joi.string(),
        last_name: v.joi.string(),
        phone: v.joi.number().min(11)
    });

    v.validate(data, schema, callback);
}

function isValid (req, callback) {
    var v = require('../../libs/validator');

    var data = {
        email: req.body.email,
        password: req.body.password
    };

    var schema = v.joi.object().keys({
        email: v.joi.string().email().required(),
        password: v.joi.string().regex(/^[a-zA-Z0-9-_]{3,30}$/).required()
    });

    v.validate(data, schema, callback);
}

// exports.auth = function (req, res, next) {
//     res.end('ok');
// };
//
// exports.register = function (req, res, next) {
//     var user = {
//         email: req.body.email,
//         password: req.body.password,
//         uuid: uuid.v4()
//     };
//
//     //TODO: sanitize and validate
//
//     var user = new User(user);
//     user.save(function (err, user) {
//         if (err) next(err);
//         res.status(200);
//         res.json({uuid: user.uuid});
//     });
// };
//
// exports.listUsers = function (req, res, next) {
//     userAPI.listUsers(function (err, data) {
//         if (err) return next(err);
//         var listOfUsers = data.map(function (a, b, d) {
//             return {
//                 uuid: a.uuid,
//                 email: a.email,
//             }
//         });
//         console.log(listOfUsers);
//         res.status(200);
//         res.json({data: listOfUsers})
//     });
//
// };
//
// exports.create = function (req, res, next) {
//     var user = {
//         email: req.body.email
//     };
//     if (!validateUser(user)) return next(400);
//
//     userAPI.create(user, function (err, user) {
//         if (err) return next(err);
//         res.status(200);
//         res.json(user.uuid);
//     });
//
// };
//
// exports.read = function (req, res, next) {
//     userAPI.read(req.params.id, function (err, user) {
//         if (err) next(err);
//
//         var viewModel = require('../../view-model/index').admin;
//         viewModel.showUserDetail(user, function (user) {
//             console.log('got user', user);
//             res.status(200);
//             res.render('admin/detalUser', {data: user});
//         });
//     });
//
// };
//
// exports.update = function (req, res, next) {
//     // var user = {
//     //     email: req.body.email
//     // };
//     // userAPI.createUser(user, function (err, user) {
//     //     if (err) return next(err);
//     //     res.status(200);
//     //     res.json(user.uuid);
//     // });
//
// };
//
// exports.delete = function (req, res, next) {
//
//     userAPI.delete(req.params.id, function (err, result) {
//         if (err) return next(err);
//         res.status(200);
//         res.json(result);
//     });
//
// };
//
// exports.drop = function (req, res, next) {
//     userAPI.drop(null, function (err, result) {
//         if (err) return next(err);
//         res.status(200);
//         res.json(result);
//     });
//
// };

function validateUser (user) {
    //TODO: validata and sanitaze
    return true;
}