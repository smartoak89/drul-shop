var adminApi = require('../handlers/admin');

module.exports = function (app) {
    app.get('/admin', adminApi.main);
    app.get('/admin/tovs', adminApi.tovs);
    app.get('/admin/categ', adminApi.categ);
    app.get('/admin/reqs', adminApi.reqs);
    app.get('/admin/stocks', adminApi.stocks);
    app.get('/admin/curr', adminApi.curr);
    app.get('/admin/deliv', adminApi.deliv);
    app.get('/admin/com', adminApi.com);
    app.get('/admin/users', adminApi.listUsers);
};