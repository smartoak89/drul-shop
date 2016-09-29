var categoryHandler = require('../handlers/api/category');
var userHandler = require('../handlers/api/user');

function getRouter(router) {
    //--Category
    router.get('/categories', categoryHandler.list);
    router.post('/category', categoryHandler.create);
    router.put('/category/:id', categoryHandler.update);
    router.post('/category/:id', categoryHandler.add);
    router.delete('/category/:id', categoryHandler.remove);
    router.delete('/category/:id/:index', categoryHandler.remove);

    //--User
    router.post('/user/register', userHandler.register);
    router.get('/users', userHandler.list);
    router.put('/user/:id', userHandler.update);

    return router;
}

module.exports = function (router) {
    return getRouter(router)
};