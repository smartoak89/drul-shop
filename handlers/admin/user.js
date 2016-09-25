var userAPI = require('../../api/user');

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

exports.listUsers = function (req, res, next) {
    userAPI.listUsers(function (err, data) {
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

exports.create = function (req, res, next) {
    var user = {
        email: req.body.email
    };
    userAPI.create(user, function (err, user) {
        if (err) return next(err);
        res.status(200);
        res.json(user.uuid);
    });

};

exports.read = function (req, res, next) {
    userAPI.read(req.params.id, function (err, user) {
        if (err) next(err);

        var viewModel = require('../../view-model').admin;
        viewModel.showUserDetail(user, function (user) {
            console.log('got user', user);
            res.status(200);
            res.render('admin/detalUser', {data: user});
        });
    });

};

exports.update = function (req, res, next) {
    // var user = {
    //     email: req.body.email
    // };
    // userAPI.createUser(user, function (err, user) {
    //     if (err) return next(err);
    //     res.status(200);
    //     res.json(user.uuid);
    // });

};

exports.delete = function (req, res, next) {

    userAPI.delete(req.params.id, function (err, result) {
        if (err) return next(err);
        res.status(200);
        res.json(result);
    });

};

exports.drop = function (req, res, next) {
    userAPI.dropUsers(null, function (err, result) {
        if (err) return next(err);
        res.status(200);
        res.json(result);
    });

};