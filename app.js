var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');
var routes = require('./routes/index');
var users = require('./routes/user');
var carts = require('./routes/cart');

var app = express();
mongoose.connect('mongodb://localhost:27017/shopping');
require('./config/passport');


// view engine setup
app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    }),
    cookie: {
        maxAge: 100 * 60 * 60 * 24
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

app.use(function(req, res, next) {
    if (req.user) {
        res.locals.session.userEmail = req.user.email;
    }
    next();
});

app.use('/user', users);
app.use('/', routes);
app.use('/cart', carts)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
// var listener = app.listen(3000, function() {
//     console.log('Listening on port ' + listener.address().port); //Listening on port 3000
// });


module.exports = app;
