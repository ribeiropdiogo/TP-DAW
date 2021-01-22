const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const crypto = require('./util/crypto')


// Mongo
const mongoose = require('mongoose')

const mongoDB = 'mongodb://127.0.0.1/RepositoriDOIS'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB...'))
db.once('open', function() {
    console.log('Conexão ao MongoDB realizada com sucesso...')
})


// Passport
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const Utilizador = require('./controllers/utilizador')

passport.use(new LocalStrategy(
    {usernameField: 'username', passwordField: 'pass'},
    (username, password, done) => {
        console.log('Verificar password...')
        Utilizador.lookupWithCredentials(username)
            .then(ut => {
                if (!ut)
                    return done(null, false, {message: 'Utilizador inexistente!\n'})
                if (!crypto.compare(password, ut))
                    return done(null, false, {message: 'Credenciais inválidas!\n'})
                return done(null, Utilizador.filter(ut))
            })
            .catch(e => done(e))
    }
))

passport.serializeUser((ut, done) => {
    console.log('Serielização, uname: ' + ut.username)
    done(null, ut.username)
})

passport.deserializeUser((username, done) => {
    console.log('Desserielização, username: ' + username)
    Utilizador.lookup(username)
        .then(ut => done(null, ut))
        .catch(e => done(e, false))
})


const utilizadoresRouter = require('./routes/utilizadores')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize())
app.use(passport.session())

app.use('/utilizadores', utilizadoresRouter)

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
    res.jsonp({error: err.message})
})


module.exports = app
