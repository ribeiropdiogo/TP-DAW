const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const Utilizador = require('../controllers/utilizador')
const Recurso = require('../controllers/recurso')
const Tipo = require('../controllers/tipo')

function getUsername(request){
    
    authHeader = request.headers['authorization']
    var myToken = authHeader && authHeader.split(' ')[1]
    let username = jwt.decode(myToken).username

    return username;
}

// GET /utilizadores
router.get('/', function(req, res) {
    Utilizador.list()
        .then(dados => res.status(200).jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})


// GET /utilizadores/:id
router.get('/:id', function(req, res) {
    Utilizador.lookup(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})

// GET /utilizadores/detalhes/:id
router.get('/detalhes/:id', function(req, res) {

    let username = getUsername(req)

    Utilizador.lookup(req.params.id)
        .then(dono => {
            Recurso.listByUser(req.params.id)
                .then(recursos => {
                    Utilizador.lookup(username)
                    .then(u => {
                        Tipo.listTop(7)
                            .then(t => { 
                                let data = {}
                                data.recursos = recursos
                                data.user = u
                                data.tipo = t
                                data.owner = dono;
                                res.status(200).jsonp(data)
                            })
                            .catch(error => res.status(500).jsonp(error))
                    })
                    .catch(erro => res.status(500).jsonp(erro))
                })
                .catch(erro => res.status(500).jsonp(erro))
        })
        .catch(erro => res.status(500).jsonp(erro))
})


// PUT /utilizadores/:id
router.put('/:id', function(req, res) {
    Utilizador.edit(req.params.id, req.body)
        .then(dados => res.status(200).jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})


// DELETE /utilizadores/:id
router.delete('/:id', function(req, res) {
    Utilizador.remove(req.params.id)
        .then(dados => res.status(200).jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})


module.exports = router
