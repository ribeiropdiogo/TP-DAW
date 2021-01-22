const express = require('express')
const router = express.Router()

const Tipo = require('../controllers/tipo')

// GET /tipos
router.get('/', function(req, res) {
    Tipo.list()
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// GET /tipos/top/:n
router.get('/top/:n', function(req, res) {
    Tipo.listTop(req.params.n)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// GET /tipos/:id
router.get('/:id', function(req, res) {
    Tipo.lookup(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// POST /tipos
router.post('/', function(req, res) {
    console.log(req.body)
    Tipo.insert(req.body)
        .then(data => res.status(201).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// PUT /tipos/:id
router.put('/:id', function(req, res) {
    Tipo.edit(req.params.id, req.body)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// DELETE /tipos/:id
router.delete('/:id', function(req, res) {
    Tipo.remove(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

module.exports = router
