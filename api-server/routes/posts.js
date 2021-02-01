const express = require('express')
const router = express.Router()

const Post = require('../controllers/post')

// GET /posts
router.get('/', function(req, res) {
    Post.list()
        .then(data => res.status(200).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

// GET /posts/:id
router.get('/:id', function(req, res) {
    Post.lookup(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

// POST /posts
router.post('/', function(req, res) {
    Post.insert(req.body)
        .then(data => res.status(201).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

// PUT /posts/:id
router.put('/:id', function(req, res) {
    Post.edit(req.params.id, req.body)
        .then(data => res.status(200).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

// DELETE /posts/:id
router.delete('/:id', function(req, res) {
    Post.remove(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

// POST /posts/comentarios/:id
router.post('/comentarios/:id', function(req, res) {
    Post.insertComment(req.params.id, req.body.comentario)
        .then(data => res.status(201).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

// DELETE /posts/comentarios/:id
router.delete('/comentarios/:id', function(req, res) {
    Post.removeComment(req.params.id, req.body.comentario)
        .then(data => res.status(200).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

module.exports = router
