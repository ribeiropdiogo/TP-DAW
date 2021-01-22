const express = require('express')
const router = express.Router()

const Utilizador = require('../controllers/utilizador')


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
