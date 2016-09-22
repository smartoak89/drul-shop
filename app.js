var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var log = require('./libs/logger')(module);
var mongoose = require('./libs/mongoose');
var conf = require('./conf');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

passport.use(new Strategy(
function(username, password, callback) {
    callback(null, username);
    // db.users.findByUsername(username, function(err, user) {
    //     if (err) { return cb(err); }
    //     if (!user) { return cb(null, false); }
    //     if (user.password != password) { return cb(null, false); }
    //     return cb(null, user);
    // });
}));

passport.serializeUser(function(user, callback) {
    callback(null, user);
});

passport.deserializeUser(function(id, cb) {
    // db.users.findById(id, function (err, user) {
    //     if (err) { return cb(err); }
    //     cb(null, user);
    // });
});

var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
        res.end('hello')
});

// var MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: 'secret'
}));

app.use(require('./middleware/sendHttpError'));

require('./routes')(app);

app.use(require('./middleware/page404'));

require('./middleware/errorHandler')(app);

http.createServer(app).listen(process.env.PORT || conf.port, function () {
    log.info('Server is listening on localhost:' + conf.port);
});