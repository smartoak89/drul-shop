module.exports = function (app, express) {
    app.use('/', require('./common')(express.Router()));
    app.use('/admin', require('./admin')(express.Router()));
    app.use('/api', require('./api')(express.Router()));
};