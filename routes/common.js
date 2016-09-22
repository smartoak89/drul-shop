var commonAPI = require('../handlers/common');
var userAPI = require('../handlers/user');

module.exports = function (app) {
    app.get('/', commonAPI.get);
    app.post('/auth', userAPI.auth);
};