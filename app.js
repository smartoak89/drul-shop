var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
var log = require('./libs/logger')(module);
var auth = require('./libs/passport');
var conf = require('./conf');

// var mongoose = require('./libs/mongoose');
//Hello Ssh git
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
app.use(auth.initialize());

var MongoStore = require('connect-mongo')(session);
app.use(session(conf.session));
app.use(flash());

app.use(require('./middleware/sendMessage'));

app.use(require('./middleware/sendHttpError'));

require('./middleware/errorHandler')(app);

require('./routes')(app, express);

app.use(require('./middleware/page404'));

http.createServer(app).listen(process.env.PORT || conf.port, function () {
    log.info('Server is listening on localhost:' + conf.port);
});
