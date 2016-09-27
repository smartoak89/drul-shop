var commonAPI = require('../handlers/common');
var userAPI = require('../handlers/admin/user');
var category = require('../handlers/category');

module.exports = function (app) {
    app.get('/', commonAPI.get);
    app.get('/api/category', category.list);
    // app.post('/user/register', userAPI.register);
    // app.post('/auth', require('../middleware/auth'), function(req, res, next) {
    //     res.end('zvezda')
    // }, userAPI.auth);
};