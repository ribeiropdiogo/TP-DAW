const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const crypto = require('../util/crypto')

const Utilizador = require('../controllers/utilizador')


// POST /utilizadores
router.post('/', function(req, res) {
    const user = req.body

    // valores por omissão
    user.admin = false
    user.dataRegisto = new Date()
    user.ultimoAcesso = user.dataRegisto

    // hashing da palavra-passe
    var hash = crypto.hasher(user.pass, crypto.generateSalt())
    user.hashedPassword = hash.hashedPassword
    user.salt = hash.salt
    user.pass = undefined

    Utilizador.insert(user)
        .then(dados => {
            jwt.sign(
                {username: dados.username, admin: dados.admin},
                'RepositoriDOIS',
                {expiresIn: '3h'},
                function(e, token) {
                    if (e) {
                        res.status(500).jsonp({error: 'Erro na geração do token: ' + e}) 
                    } else {
                        dados.token = token
                        res.status(201).jsonp(Utilizador.filter(dados))
                    }
                }
            )
        })
        .catch(e => {
            if (e.name === 'MongoError' && e.code === 11000)
                res.status(409)
            else 
                res.status(500)
            res.jsonp({error: e})
        })
})


// POST /utilizadores/login
router.post('/login', passport.authenticate('local'), function(req, res) {
    jwt.sign(
        {username: req.user.username, admin: req.user.admin},
        'RepositoriDOIS',
        {expiresIn: '3h'},
        function(e, token) {
            if (e) {
                res.status(500).jsonp({error: 'Erro na geração do token: ' + e}) 
            } else {
                req.user.token = token
                res.status(200).jsonp(req.user)
            }
        }
    )
})


module.exports = router
