function getRouter(router) {
    router.get('/', function (req,res,next) {
        req.session.currency = "$";
        console.log(req.session);
        res.render('main/index');
    });

    router.get('/auth', function (req, res, next) {
        res.render('common/auth');
    });

    router.post('/auth', require('../middleware/auth'), function (req, res, next) {
        console.log('Auth all right');
        res.redirect(req.session.returnTo);
    });

    return router;
}

module.exports = function (router) {
    return getRouter(router)
};

// var commonAPI = require('../handlers/common');
// var userAPI = require('../handlers/api/user');
// var category = require('../handlers/api/category');
//
// module.exports = function (app) {
//     app.get('/', commonAPI.get);
//
//     // app.post('/user/register', userAPI.register);
//     // app.post('/auth', require('../middleware/auth'), function(req, res, next) {
//     //     res.end('zvezda')
//     // }, userAPI.auth);
// };