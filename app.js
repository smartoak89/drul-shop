var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var log = require('./libs/logger')(module);
var mongoose = require('./libs/mongoose');
var conf = require('./conf');

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

// var MongoStore = require('connect-mongo')(session);
// app.use(session({
//     secret: conf.session.secret,
//     key: conf.session.key,
//     coockie: conf.session.coockie,
//     store: new MongoStore({ mongooseConnection: mongoose.connection })
// }));

app.use(require('./middleware/sendHttpError'));

require('./routes/common')(app);

app.use(require('./middleware/page404'));

require('./middleware/errorHandler')(app);

http.createServer(app).listen(process.env.PORT || conf.port, function () {
    log.info('Server is listening on localhost:' + conf.port);
});