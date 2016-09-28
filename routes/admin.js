var adminHandler = require('../handlers/admin/admin');
var userHandler = require('../handlers/admin/user');
var categoryHandler = require('../handlers/category');

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

    app.get('/admin/list-users', userHandler.listUsers);
    app.post('/user', userHandler.create);
    app.get('/admin/user/:id', userHandler.read);
    app.put('/user/:id', userHandler.update);
    app.delete('/user/:id', userHandler.delete);
    app.get('/drop-users', userHandler.drop);

    app.post('/api/category', categoryHandler.create);
    app.put('/api/category/:id', categoryHandler.update);
    app.post('/api/category/:id', categoryHandler.add);
    app.delete('/api/category/:id', categoryHandler.remove);
    app.delete('/api/category/:id/:index', categoryHandler.remove);
};