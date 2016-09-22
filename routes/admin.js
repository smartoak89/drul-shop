var adminApi = require('../handlers/admin');

module.exports = function (app) {
    app.get('/admin', adminApi.getAdmin);
    app.get('/admin/tovs', adminApi.adminTovs);
    app.get('/admin/categ', adminApi.adminCateg);
    app.get('/admin/reqs', adminApi.adminReqs);
    app.get('/admin/stocks', adminApi.adminStocks);
    app.get('/admin/curr', adminApi.adminCurr);
    app.get('/admin/deliv', adminApi.adminDeliv);
    app.get('/admin/com', adminApi.adminCom);
};