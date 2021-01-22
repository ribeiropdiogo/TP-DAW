const express = require('express')
const router = express.Router()

const Recurso = require('../controllers/recurso')

// GET /recursos
router.get('/', function(req, res) {
    Recurso.list()
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// GET /recursos/:id
router.get('/:id', function(req, res) {
    Recurso.lookup(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// POST /recursos
router.post('/', function(req, res) {
    req.body.dataRegisto = new Date().toISOString().slice(0,19);
    Recurso.insert(req.body)
        .then(data => res.status(201).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// PUT /recursos/:id
router.put('/:id', function(req, res) {
    Recurso.edit(req.params.id, req.body)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// DELETE /recursos/:id
router.delete('/:id', function(req, res) {
    Recurso.remove(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

module.exports = router
