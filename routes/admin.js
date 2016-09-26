var handler = require('../handlers/admin');
var user = require('../handlers/admin/user');
module.exports = function (app) {
    app.get('/admin', handler.main);
    app.get('/admin/tovs', handler.tovs);
    app.get('/admin/categ', handler.categ);
    app.get('/admin/reqs', handler.reqs);
    app.get('/admin/stocks', handler.stocks);
    app.get('/admin/curr', handler.curr);
    app.get('/admin/deliv', handler.deliv);
    app.get('/admin/com', handler.com);
    app.get('/admin/users', handler.users);

    app.get('/admin/list-users', user.listUsers);
    app.post('/user', user.create);
    app.get('/admin/user/:id', user.read);
    app.put('/user/:id', user.update);
    app.delete('/user/:id', user.delete);
    app.get('/drop-users', user.drop);
};