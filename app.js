var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
var log = require('./libs/logger')(module);
var passport = require('./libs/passport');
var conf = require('./conf');
var redis   = require("redis");
var client  = redis.createClient();
var redisStore = require('connect-redis')(session);

var app = express();

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/sendMessage'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());
app.use(cookieParser());

conf.session.store = new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260});

app.use(session(conf.session));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes')(app, express);

app.use(require('./middleware/page404'));

require('./middleware/errorHandler')(app);

http.createServer(app).listen(process.env.PORT || conf.port, function () {
    log.info('Server is listening on localhost:' + conf.port);
});
