/*
Updating the app to use Twitter OAUTH 1.0a authentication. Nothing to change here but one
mount point; everything will be done in authTwitter, which is mounted on /auth
 */
let express = require('express')
let path = require('path')
let favicon = require('serve-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
let passport = require('passport')

//flash is used with passport to pop up messages
let flash = require('connect-flash')
//and flash requires session. We'll also want passport-session.

//var routes = require('./routes/index');
let api = require('./routes/api')
let auth = require('./routes/authTwitter')
let events = require('./routes/events')
let youtube = require('./routes/youtube')

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Pass anything other than mounted routes to Angular
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'this is not a secret' }));
app.use(passport.initialize());
app.use(passport.session());

//Back end APIis sered on the /api route
app.use('/api', api);
app.use('/auth', auth);
app.use('/events', events);
app.use('/youtube', youtube);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
    err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development' || true) {
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
//  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
