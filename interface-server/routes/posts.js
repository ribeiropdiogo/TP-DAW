var express = require('express')
var router = express.Router()
var axios = require('axios')


//Detalhes de um Post
router.get('/:id', function(req, res) {
    res.jsonp("Interface Posts work.")
    res.render('index', { title: 'Express' })
})

//Editar um Post --> tem de ser o dono
router.put('/:id', function(req, res) {
    res.render('index', { title: 'Express' })
})

router.post('/', function(req, res) {
    var headers = { headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.cookies.token}`
    }}

    axios.post('http://localhost:7000/posts', req.body, headers)
        .then(resp => res.status(201).jsonp(resp.data))
        .catch(erro => res.status(404).jsonp(erro.data))
})

//Comentario
router.post('/comentario', function(req, res) {
    res.render('index', { title: 'Express' })
})

//Comentarios de comentarios? IDK

//Apagar post --> Só pode se for o produtor
router.delete('/delete', function(req, res) {
    res.render('index', { title: 'Express' })
})

module.exports = router
