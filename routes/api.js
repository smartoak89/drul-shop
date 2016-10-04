var categoryHandler = require('../handlers/api/category');
var userHandler = require('../handlers/api/user');
var productHandler = require('../handlers/api/product');

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
    router.delete('/user/:id', userHandler.remove);
    router.get('/user/:id', userHandler.find);
    router.post('/user/auth', userHandler.auth);

    //--Product
    router.post('/product', productHandler.create);
    router.get('/products', productHandler.list);
    router.put('/product/:id', productHandler.update);
    router.delete('/product/:id', productHandler.remove);

    return router;
}

module.exports = function (router) {
    return getRouter(router)
};