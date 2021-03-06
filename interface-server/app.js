const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
var bodyParser = require('body-parser')

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

var cookieParser = require('cookie-parser');

var { v4: uuidv4 } = require('uuid');
var session = require('express-session');
const FileStore = require('session-file-store')(session);
var axios = require('axios')

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


passport.use(new GoogleStrategy({
    clientID: '208792506217-bb9p418he6jq6ve8kjvejj4hr20eau4t.apps.googleusercontent.com',
    clientSecret: 'P_st4hIFKjJlF1Kmb_8O0wDS',
    callbackURL: "http://localhost:8000/utilizadores/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
        var userData = {}
        userData.profile = profile;
        userData.accessToken = accessToken;
        return done(null, userData);
  }
));

passport.use(new FacebookStrategy({
    clientID: '1815453438611392',
    clientSecret: '3827d296b5d3f7a038aac6e2b716d3ce',
    callbackURL: "http://localhost:8000/utilizadores/facebook/callback",
    profileFields: ["email", "name"]
  }, function (accessToken, refreshToken, profile, done) {
    var userData = {}
    userData.profile = profile;
    userData.accessToken = accessToken;
    return done(null, userData);
  }
));


passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


const indexRouter = require('./routes/index')
const usersRouter = require('./routes/utilizadores')
const postsRouter = require('./routes/posts')
const noticiasRouter = require('./routes/noticias')
const recursosRouter = require('./routes/recursos')
const tiposRouter = require('./routes/tipos')

var app = express()


// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser('wazzzup'));
app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize());
//app.use(passport.session());


app.use(function(req, res, next){
    //console.log('Signed Cookies: ', JSON.stringify(req.signedCookies))
    //console.log('Session: ', JSON.stringify(req.session))
    next()
  })

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/posts', postsRouter)
app.use('/noticias', noticiasRouter)
app.use('/recursos', recursosRouter)
app.use('/utilizadores', usersRouter)
app.use('/tipos', tiposRouter)
app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
