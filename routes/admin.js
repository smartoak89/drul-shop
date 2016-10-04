var adminHandler = require('../handlers/templates/admin-templates');

function getRouter(router) {
    router.get('/', function (req, res, next) {
        res.render('admin/admin');
    });

    return router;
}

module.exports = function (router) {
    return getRouter(router)
};
//
// module.exports = function (app) {
//     app.get('/admin', adminHandler.main);
//     app.get('/admin/tovs', adminHandler.tovs);
//     app.get('/admin/categ', adminHandler.categ);
//     app.get('/admin/reqs', adminHandler.reqs);
//     app.get('/admin/stocks', adminHandler.stocks);
//     app.get('/admin/curr', adminHandler.curr);
//     app.get('/admin/deliv', adminHandler.deliv);
//     app.get('/admin/com', adminHandler.com);
//     app.get('/admin/users', adminHandler.users);
// };
