exports.getAdmin = function (req, res, next) {
    res.render('admin/admin');
};

exports.adminTovs = function (req, res, next) {
    res.render('admin/tovs');
};
exports.adminCateg = function (req, res, next) {
    res.render('admin/categ');
};
exports.adminReqs = function (req, res, next) {
    res.render('admin/reqs');
};
exports.adminStocks = function (req, res, next) {
    res.render('admin/stocks');
};
exports.adminCurr = function (req, res, next) {
    res.render('admin/curr');
};
exports.adminDeliv = function (req, res, next) {
    res.render('admin/deliv');
};
exports.adminCom = function (req, res, next) {
    res.render('admin/com');
};