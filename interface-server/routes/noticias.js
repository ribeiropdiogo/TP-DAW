const express = require('express')
const router = express.Router()
const axios = require('axios')


router.post('/', function(req, res) {
    var headers = { headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.cookies.token}`
    }}

    axios.post('http://localhost:7000/noticias', req.body, headers)
        .then(dados => res.status(201).jsonp(dados.data))
        .catch(e => res.status(500).jsonp(e.data))
})

router.delete('/:id', function(req, res) {
    var headers = { headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.cookies.token}`
    }}

    axios.delete('http://localhost:7000/noticias/'+req.params.id, headers)
        .then(dados => res.status(200).jsonp(dados.data))
        .catch(e => res.status(500).jsonp(e.data))
})


module.exports = router
