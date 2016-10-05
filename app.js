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
var redisStore = require('connect-redis')(session);
var redisCli = require('./libs/redis');
var app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
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

app.use(session({
        secret: conf.session.secret,
        key: conf.session.key,
        coockie: conf.session.coockie,
        store: new redisStore({
            client: redisCli,
            ttl: conf.redis.ttl
        })
    }
));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes')(app, express);

app.use(require('./middleware/page404'));

require('./middleware/errorHandler')(app);

http.createServer(app).listen(process.env.PORT || conf.port, function () {
    log.info('Server is listening on localhost:' + conf.port);
});
