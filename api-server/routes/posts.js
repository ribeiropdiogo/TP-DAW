const express = require('express')
const router = express.Router()

const Post = require('../controllers/post')

function filterPosts(data, query_user, admin) {
    if (admin == true)
        return data
    
    var i
    var response = []
    
    for (i = 0; i < data.length; i++) {
        if(data[i].rec.visibilidade == "Público" || data[i].autor == query_user)
            response.push(data[i])
    } 

    return response
}

// GET /posts
router.get('/', function(req, res) {
    Post.list()
        .then(dados => res.status(200).jsonp(filterPosts(dados, req.token.username, req.token.admin)))
        .catch(e => res.status(500).jsonp({error: e}))
})

// POST /posts
router.post('/', function(req, res) {
    req.body.comentarios = []
    req.body.data = new Date()

    Post.insert(req.body)
        .then(data => res.status(201).jsonp(data))
        .catch(e => res.status(500).jsonp({error: e}))
})

// DELETE /posts/:id
router.delete('/:id', function(req, res) {
    if (req.token.admin == true) {
        Post.remove(req.params.id)
            .then(dados => res.status(200).jsonp(dados))
            .catch(e => res.status(500).jsonp({error: e}))
    } else {
        Post.lookup(req.params.id)
            .then(dados => {
                if (req.token.username == dados.data.utilizador) {
                    Post.remove(req.params.id)
                        .then(dados => res.status(200).jsonp(dados))
                        .catch(e => res.status(500).jsonp({error: e}))
                } else {
                    res.status(401).send()
                }
            })
            .catch(e => res.status(500).jsonp({error: e}))
    }
})

// POST /posts/comentarios/:id
router.post('/comentarios/:id', function(req, res) {
    req.body.data = new Date()
    
    Post.insertComment(req.params.id, req.body)
        .then(dados => res.status(201).jsonp(dados.comentarios[dados.comentarios.length-1]))
        .catch(e => res.status(500).jsonp({error: e}))
})

// DELETE /posts/comentarios/:id
router.delete('/comentarios/:id', function(req, res) {
    if (req.token.admin == true) {
        Post.removeComment(req.params.id, req.body.id)
            .then(dados => res.status(200).jsonp(dados))
            .catch(e => res.status(500).jsonp({error: e}))
    } else {
        Post.removeCommentIfOwner(req.params.id, req.body.id, req.token.username)
            .then(dados => res.status(200).jsonp(dados))
            .catch(e => res.status(500).jsonp({error: e}))
    }
})

module.exports = router
