const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const crypto = require('../util/crypto')

const Utilizador = require('../controllers/utilizador')


// POST /utilizadores
router.post('/', createAccount, sign, function(req, res) {
    res.status(201).jsonp({token: req.token})
})


// POST /utilizadores/login
router.post('/login', authenticate, sign, function(req, res) {
    res.status(200).jsonp({token: req.token})
})


function createAccount(req, res, next) {
    const user = req.body

    // valores por omissão
    user.admin = false
    user.dataRegisto = new Date()
    user.ultimoAcesso = user.dataRegisto

    // hashing da palavra-passe
    var hash = crypto.hasher(user.password, crypto.generateSalt())
    user.hashedPassword = hash.hashedPassword
    user.salt = hash.salt
    user.password = undefined

    Utilizador.insert(user)
        .then(dados => {
            req.user = {username: dados.username, admin: dados.admin}
            next()
        })
        .catch(e => {
            if (e.name === 'MongoError' && e.code === 11000)
                res.status(409)
            else 
                res.status(500)
            res.jsonp({error: e})
        })
}


function authenticate(req, res, next) {
    Utilizador.lookupCredentials(req.body.username)
        .then(dados => {
            if (!dados) {
                res.status(401).jsonp({error: 'Utilizador inexistente!'})

            } else if (!crypto.compare(req.body.password, dados)) {
                res.status(401).jsonp({error: 'Credenciais inválidas!'})

            } else {
                req.user = {username: dados.username, admin: dados.admin}
                next()
            }
        })
        .catch(e => res.status(500).jsonp({error: e}))
}


function sign(req, res, next) {
    const user = req.user

    jwt.sign(
        {username: user.username, admin: user.admin},
        'RepositoriDOIS',
        {expiresIn: '1h'},
        function(e, token) {
            if (e) {
                res.status(500).jsonp({error: e})
            } else {
                req.token = token
                next()
            }
        }
    )
}


module.exports = router
