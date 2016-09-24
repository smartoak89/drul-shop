var handler = require('../handlers/admin');

module.exports = function (app) {
    app.get('/admin', handler.main);
    app.get('/admin/tovs', handler.tovs);
    app.get('/admin/categ', handler.categ);
    app.get('/admin/reqs', handler.reqs);
    app.get('/admin/stocks', handler.stocks);
    app.get('/admin/curr', handler.curr);
    app.get('/admin/deliv', handler.deliv);
    app.get('/admin/com', handler.com);
    app.get('/admin/users', handler.listUsers);
};