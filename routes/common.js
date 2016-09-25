var commonAPI = require('../handlers/common');
var userAPI = require('../handlers/admin/user');

module.exports = function (app) {
    app.get('/', commonAPI.get);
    // app.post('/user/register', userAPI.register);
    // app.post('/auth', require('../middleware/auth'), function(req, res, next) {
    //     res.end('zvezda')
    // }, userAPI.auth);
};