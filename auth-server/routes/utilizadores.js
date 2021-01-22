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
    var hash = crypto.hasher(user.password, crypto.generateSalt())
    user.hashedPassword = hash.hashedPassword
    user.salt = hash.salt
    user.password = undefined

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
                        var res_obj = {
                            token: token,
                            utilizador: Utilizador.filter(dados)
                        }
                        res.status(201).jsonp(res_obj)
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
                var res_obj = {
                    token: token,
                    utilizador: req.user
                }
                res.status(200).jsonp(res_obj)
            }
        }
    )
})


module.exports = router
