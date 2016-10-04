module.exports = function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        if (req.session) {
            req.session.returnTo = req.originalUrl || req.url;
        }
        return res.redirect('/auth');
    }
    next();
};