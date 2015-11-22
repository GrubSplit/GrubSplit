var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var https = require('https');

var flash = require('express-flash');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');

// Database set up
var mongoose = require('mongoose');
// Connect to either the MONGOLAB_URI or to the local database.
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log("database connected");
});

// Import Delivery library
var Delivery = require('./libraries/Delivery');

// Import route handlers
var index = require('./routes/index');
var users = require('./routes/users');
var grubs = require('./routes/grubs');
var subgrubs = require('./routes/subgrubs');
var restaurant = require('./routes/restaurant');
var auth = require('./routes/auth');

// Import models
var User = require('./models/User');
var Grub = require('./models/Grub');

var app = express();

// Create HTTPS server
https.createServer({
  key: fs.readFileSync('local-key.pem'),
  cert: fs.readFileSync('local-cert.pem')
}, app).listen(3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
// FIXME: Is this secure?
app.use(session({
  secret: '6170',
  resave: true,
  saveUninitialized: true
}));
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// passport config
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Allow current user to be accessed from templates
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

var isLoggedIn = function(req, res, next) {
  if (req.user) {
    return next();
  }
  res.redirect('/users/login');
}

var isAuthenticated = function(req, res, next) {
  if (req.user) {
    if (req.user.token && req.user.refresh_token) {
      return next();
    }
    return res.redirect(Delivery.authorizeAccountURL());
  }
  return res.redirect('/users/login');
};

// Map paths to imported route handlers
app.use('/$', isAuthenticated, index);
app.use('/users', users);
app.use('/grubs', isAuthenticated, grubs);
app.use('/subgrubs', isAuthenticated, subgrubs);
app.use('/restaurant', isAuthenticated, restaurant);
app.use('/auth', isLoggedIn, auth);

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


module.exports = app;