const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
var bodyParser = require('body-parser')

const mongoDB = 'mongodb://127.0.0.1/RepositoriDOIS'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})

const db = mongoose.connection
db.on('error', function() {
    console.log('Error connecting to MongoDB...')
})
db.once('open', function() {
    console.log('Connected to MongoDB...')
})

const usersRouter = require('./routes/utilizadores')
const postsRouter = require('./routes/posts')
const tiposRouter = require('./routes/tipos')
const recursosRouter = require('./routes/recursos')

var app = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/utilizadores', usersRouter)
app.use('/recursos', recursosRouter)
app.use('/posts', postsRouter)
app.use('/tipos', tiposRouter)

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
    res.jsonp('Error: path not found on this server...')
})

module.exports = app
