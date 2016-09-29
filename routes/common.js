function getRouter(router) {
    router.get('/', function (req,res,next) {
        res.render('main/index');
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