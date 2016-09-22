var adminApi = require('../handlers/admin');

module.exports = function (app) {
    app.get('/admin', adminApi.getAdmin);
};