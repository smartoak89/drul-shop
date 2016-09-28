module.exports = function (app) {
    require('./api')(app);
    require('./admin')(app);
    require('./common')(app);
};