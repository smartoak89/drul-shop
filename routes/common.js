var commonAPI = require('../handlers/common');
var userAPI = require('../handlers/userAPI');

module.exports = function (app) {
    app.get('/', commonAPI.get);
    app.post('/auth', userAPI.auth);
};