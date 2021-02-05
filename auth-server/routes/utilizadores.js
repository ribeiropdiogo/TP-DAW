const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('../util/crypto')

const Utilizador = require('../controllers/utilizador')


// POST /utilizadores
router.post('/', createAccount, sign, function(req, res) {
    res.status(201).jsonp({token: req.token})
})


// POST /utilizadores/login
router.post('/login', authenticate, sign, function(req, res) {
    Utilizador.updateUltimoAcesso(req.user.username, new Date())
        .then(dados => res.status(200).jsonp({token: req.token}))
        .catch(e => res.status(500).jsonp({error: e}))
})


// Forgot PWD
router.post('/recuperaPassword', forgotPwd, function(req, res) {
    res.status(200).jsonp({msg: req.msg})
})


// Forgot PWD
router.post('/redefinePassword/', verificaToken, atualizaPwd, authenticate, sign, function(req, res) {
    res.status(200).jsonp({token: req.token})
})



function forgotPwd(req, res, next) {
    
    Utilizador.lookupUserByEmail(req.body.email)
        .then(dados => {
            if (!dados) {
                res.status(401).jsonp({error: 'Utilizador inexistente!'})
            } else {

                const novo_token = jwt.sign({username: dados.username, purpose:'password-reset'}, 
                                    dados.hashedPassword, {expiresIn: '20m'});

                console.log(novo_token)
                
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
                    text: 'Se efetuou um pedido de reposição de password pode aceder a: \n'
                        + `http:\//127.0.0.1:8000/redefinePassword/${novo_token}` + ' para repô-la, caso contrário, simplesmente ignore este email.'
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


function verificaToken(req, res, next) {

    var rec_token = req.body.token

    if(jwt.decode(rec_token).purpose){

        var usrname = jwt.decode(rec_token).username        
 
        Utilizador.lookupCredentials(usrname)
            .then(dados => {
                if (!dados) {
                    res.status(401).jsonp({error: 'Utilizador inexistente!'})

                    //IF TOKEN IGUAL && NÃO TIVER EXPIRADO
                }else {
                    jwt.verify(rec_token, dados.hashedPassword, function(e, payload){
                        if(e){
                            res.status(401).jsonp({error: e})
                        }else{
                            req.body.username = dados.username
                            next()
                        }
                    })
                }
            })
            .catch(e => res.status(500).jsonp({error: e}))
    
    }else{
        res.status(401).jsonp({error: 'Token de Reset Inválido!'})
    }
    
}


//## RESET PWD ##//
function atualizaPwd(req, res, next) {

    //Gerar nova Hash e Update
    var hash = crypto.hasher(req.body.newPassword, crypto.generateSalt())
    
    hashedPassword = hash.hashedPassword
    salt = hash.salt
    //Para mandar para o authenticate
    req.body.password = req.body.newPassword
    req.body.newPassword = undefined
    req.body.passwordConfirm = undefined

    Utilizador.updatePwd(req.body.username, hashedPassword, salt)

        .then(d => {
            req.msg = 'Password Atualizada!'
            next()
        })
        .catch(e => res.status(500).jsonp({error: e}))
}
//#################//

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
