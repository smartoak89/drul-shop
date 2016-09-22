module.exports = function (app) {
    require('./common')(app);
    require('./admin')(app);
};