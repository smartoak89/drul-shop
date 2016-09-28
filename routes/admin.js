var adminHandler = require('../handlers/templates/admin-templates');

module.exports = function (app) {
    app.get('/admin', adminHandler.main);
    app.get('/admin/tovs', adminHandler.tovs);
    app.get('/admin/categ', adminHandler.categ);
    app.get('/admin/reqs', adminHandler.reqs);
    app.get('/admin/stocks', adminHandler.stocks);
    app.get('/admin/curr', adminHandler.curr);
    app.get('/admin/deliv', adminHandler.deliv);
    app.get('/admin/com', adminHandler.com);
    app.get('/admin/users', adminHandler.users);
};