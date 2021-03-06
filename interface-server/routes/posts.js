const express = require('express')
const router = express.Router()
const axios = require('axios')


router.post('/', function(req, res) {
    var headers = { headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.cookies.token}`
    }}

    axios.post('http://localhost:7000/posts', req.body, headers)
        .then(dados => res.status(201).jsonp(dados.data))
        .catch(e => res.status(500).jsonp(e.data))
})

router.post('/comentarios/:id', function(req, res) {
    var headers = { headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.cookies.token}`
    }}

    axios.post('http://localhost:7000/posts/comentarios/'+req.params.id, req.body, headers)
        .then(dados => res.status(201).jsonp(dados.data))
        .catch(e => res.status(500).jsonp(e.data))
})

router.delete('/:id', function(req, res) {
    var headers = { headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.cookies.token}`
    }}

    axios.delete('http://localhost:7000/posts/'+req.params.id, headers)
        .then(dados => res.status(200).jsonp(dados.data))
        .catch(e => res.status(500).jsonp(e.data))
})

router.delete('/comentarios/:id', function(req, res) {
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.cookies.token}`
    }
    
    axios.delete('http://localhost:7000/posts/comentarios/'+req.params.id, {data: req.body, headers: headers})
        .then(dados => res.status(200).jsonp(dados.data))
        .catch(e => res.status(500).jsonp({error: e}))
})


module.exports = router
