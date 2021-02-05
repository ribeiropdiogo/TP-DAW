const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')


// Mongo
const mongoose = require('mongoose')

const mongoDB = 'mongodb://127.0.0.1/RepositoriDOIS'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})

const db = mongoose.connection
db.on('error', function() {
    console.log('Error connecting to MongoDB...')
})
db.once('open', function() {
    console.log('Connected to MongoDB...')
})


const utilizadoresRouter = require('./routes/utilizadores')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

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
