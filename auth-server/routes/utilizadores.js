const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const crypto = require('../util/crypto')

const Utilizador = require('../controllers/utilizador')

const nodemailer = require('nodemailer')

// POST /utilizadores
router.post('/', createAccount, sign, function(req, res) {
    res.status(201).jsonp({token: req.token})
})


// POST /utilizadores/login
router.post('/login', authenticate, sign, function(req, res) {
    res.status(200).jsonp({token: req.token})
})


// RECUPERAR PWD
router.post('/esqueceuPassword', forgotPwd, function(req, res) {
    res.status(200).jsonp({msg: req.msg})
})


function forgotPwd(req, res, next) {
    
    Utilizador.lookupUser(req.body.email)
        .then(dados => {
            if (!dados) {
                res.status(401).jsonp({error: 'Utilizador inexistente!'})
            } else {

                //Gerar Token, guardar na DB e enviar por email
                var token = crypto.generateResetToken()
                var hashedToken = crypto.generateTokenHash(token, dados.salt)

                //Tempo máximo para Reset -> milissegundos
                var tokenExpira = Date.now() + 30 * 60 * 1000

                Utilizador.updateResetToken(req.body.email, hashedToken, tokenExpira)

                //Enviar Email//
                const transporter = nodemailer.createTransport({

                    service: 'Gmail',
                    auth: {
                        user: 'daw.smtp@gmail.com',
                        pass: 'testehelloworld123'
                    }
                })

                const mailOptions = {
                    from: 'daw.smtp@gmail.com',
                    to: req.body.email,
                    subject: 'Recuperação de Password - RepositoriDOIS',
                    text: 'Se efetuou um pedido de reposição de password pode aceder a: '
                        + `http:\//127.0.0.1:8000/recuperaPassword/${token}` + ' para repô-la, caso contrário, simplesmente ignore este email.'
                };

                try{
                    
                    transporter.sendMail(mailOptions)
                    req.msg = 'Email de Reset Enviado!'
                }catch(err){
                    req.msg = err
                }

                next()
            }
        })
        .catch(e => res.status(500).jsonp({error: e}))
}


function createAccount(req, res, next) {
    const user = req.body

    // valores por omissão
    user.admin = false
    user.dataRegisto = new Date()
    user.ultimoAcesso = user.dataRegisto
    user.starred = [];
    user.resetToken = null;
    user.resetTokenExp = null;

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
