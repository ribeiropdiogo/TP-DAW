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

//################################

//Detalhes de um Post
router.get('/:id', function(req, res) {
    res.jsonp("Interface Posts work.")
    res.render('index', { title: 'Express' })
})

//Editar um Post --> tem de ser o dono
router.put('/:id', function(req, res) {
    res.render('index', { title: 'Express' })
})

//Comentario
router.post('/comentario', function(req, res) {
    res.render('index', { title: 'Express' })
})

//Apagar post --> Só pode se for o produtor
router.delete('/delete', function(req, res) {
    res.render('index', { title: 'Express' })
})


module.exports = router
