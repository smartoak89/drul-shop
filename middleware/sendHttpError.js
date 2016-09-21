module.exports = function (req, res, next) {
    res.sendHttpError = function (error) {
        res.status(error.status);
        res.render('common/error-page', {error: error});
    };
    next();
};