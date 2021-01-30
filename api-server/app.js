const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')

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
const pagsRouter = require('./routes/paginas')

var blacklist = []

var app = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//Verifica se o pedido vem com token de acesso
app.use(function(req, res, next) {

    authHeader = req.headers['authorization']
    var myToken = authHeader && authHeader.split(' ')[1] || req.query.token || req.body.token

    if(myToken){
        jwt.verify(myToken, "RepositoriDOIS", function(e, payload){
            if(e){
                res.status(401).jsonp({error: e})
            }else{

                let blacklisted = verifyBlacklisted(myToken)

                if(blacklisted == true){
                    res.status(401).jsonp({error: "Token Inválido!"})
                }else{
                    next()
                }
            }
        })
    }else{
        res.status(401).jsonp({error: "Token Inexistente!"})
    }
})

//Função para add do token à blacklist
app.use(function(req, res, next) {

    if(req.body.blacklist){
        blacklist.push(req.body.token)
        console.log(blacklist)
        res.status(200).jsonp({error: "Logout realizado com sucesso!"})
    }else{
        next()
    }

})

app.use('/utilizadores', usersRouter)
app.use('/recursos', recursosRouter)
app.use('/posts', postsRouter)
app.use('/tipos', tiposRouter)
app.use('/paginas', pagsRouter)

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


function verifyBlacklisted(tkn){
    
    let result = false;

    blacklist.forEach(function(entry) {

        if(entry == tkn){
            console.log("True")
            return result = true;
        }

    });

    return result;
}



function clearBlacklist(){
    console.log('Limpeza da Blacklist!')
    
    blacklist.forEach(function(entry) {

        let tkn_exp = jwt.decode(entry).exp
        let now = parseInt(Date.now()/1000)

        console.log(now)
        console.log(tkn_exp)

        if(now >= tkn_exp){
            blacklist.splice(blacklist.indexOf(entry), 1);
        }

    });
}

clearBlacklist();

//Set for 15 minutes
setInterval(function(){
    clearBlacklist()
}, 900000)

module.exports = app
