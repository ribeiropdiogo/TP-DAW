const express = require('express')
const router = express.Router()

const Noticia = require('../controllers/noticia')

// GET /noticias
router.get('/', function(req, res) {
    Noticia.list()
        .then(data => res.status(200).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

// GET /noticias/:id
router.get('/:id', function(req, res) {
    Noticia.lookup(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

// POST /noticias
router.post('/', function(req, res) {
    req.body.data = new Date()

    Noticia.insert(req.body)
        .then(data => res.status(201).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

// PUT /noticias/:id
router.put('/:id', function(req, res) {
    Post.edit(req.params.id, req.body)
        .then(data => res.status(200).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

// DELETE /noticias/:id
router.delete('/:id', function(req, res) {
    Noticia.remove(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

module.exports = router
