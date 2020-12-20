const express = require('express')
const router = express.Router()

const Post = require('../controllers/post')

// GET /posts
router.get('/', function(req, res) {
    Post.list()
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// GET /posts/:id
router.get('/:id', function(req, res) {
    Post.lookup(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// POST /posts
router.post('/', function(req, res) {
    Post.insert(req.body)
        .then(data => res.status(201).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// PUT /posts/:id
router.put('/:id', function(req, res) {
    Post.edit(req.params.id, req.body)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// DELETE /posts/:id
router.delete('/:id', function(req, res) {
    Post.remove(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// Post Comentários
// Fazer Igual para os Likes ?
// POST /posts/comentarios/:id
router.post('/comentarios/:id', function(req, res) {
    // TODO
})

module.exports = router
