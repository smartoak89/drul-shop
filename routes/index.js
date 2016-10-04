module.exports = function (app, express) {
    app.use('/',  require('./common')(express.Router()));
    app.use('/admin', require('../middleware/isAuth'), require('./admin')(express.Router()));
    app.use('/api', require('./api')(express.Router()));
};