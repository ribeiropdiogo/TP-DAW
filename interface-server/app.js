const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')

var cookieParser = require('cookie-parser');

var { v4: uuidv4 } = require('uuid');
var session = require('express-session');
const FileStore = require('session-file-store')(session);
var axios = require('axios')

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

// Configuração da estratégia local
/*
passport.use( new LocalStrategy({
    usernameField: 'username',
    passwordField : 'pass',
}, (username, pass, done) => {
      axios.post('http://localhost:7000/utilizadores/login', {username, pass})
        .then(dados => {
          const user = dados.data
          if(!user) { return done(null, false, {message: 'Utilizador inexistente!\n'})}
           return done(null, user)
        })
        .catch(erro => done(erro))
      })
  )

*/

/*
// Indica-se ao passport como serializar o utilizador
passport.serializeUser((user,done) => {
    //console.log('Serialização, id: ' + user._id)
    done(null, user._id)
  })

// Desserialização: a partir do id obtem-se a informação do utilizador
passport.deserializeUser((uid, done) => {
    console.log('Desserielização, id: ' + uid)
    axios.get('http://localhost:7000/utilizadores/' + uid)
      .then(dados => done(null, dados.data))
      .catch(erro => done(erro, false))
  })
*/

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/utilizadores')
const postsRouter = require('./routes/posts')
const recursosRouter = require('./routes/recursos')
const tiposRouter = require('./routes/tipos')

var app = express()

//#Sessão#//
/*
app.use(session({
    genid: req => {
      return uuidv4()
    },
    store: new FileStore(),
    secret: 'wazzzup',
    resave: false,
    saveUninitialized: false,
  }))
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser('wazzzup'));
app.use(express.static(path.join(__dirname, 'public')))

/*
app.use(passport.initialize());
app.use(passport.session());
*/

/*
app.use(function(req, res, next){
    console.log('Signed Cookies: ', JSON.stringify(req.signedCookies))
    console.log('Session: ', JSON.stringify(req.session))
    next()
  })

*/

app.use('/posts', postsRouter)
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
