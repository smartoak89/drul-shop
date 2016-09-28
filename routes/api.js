var userHandler = require('../handlers/api/user');
var categoryHandler = require('../handlers/api/category');

module.exports = function (app) {
    app.get('/admin/list-users', userHandler.listUsers);
    app.post('/user', userHandler.create);
    app.get('/admin/user/:id', userHandler.read);
    app.put('/user/:id', userHandler.update);
    app.delete('/user/:id', userHandler.delete);
    app.get('/drop-users', userHandler.drop);
    // --user
    // app.post('/api/user/register', )

    //--category
    app.post('/api/category', categoryHandler.create);
    app.put('/api/category/:id', categoryHandler.update);
    app.post('/api/category/:id', categoryHandler.add);
    app.delete('/api/category/:id', categoryHandler.remove);
    app.delete('/api/category/:id/:index', categoryHandler.remove);
};