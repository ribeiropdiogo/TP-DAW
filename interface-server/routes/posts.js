var express = require('express');
var router = express.Router();


//Detalhes de um Post
router.get('/:id', function(req, res, next) {
    res.jsonp("Interface Posts work.")
    res.render('index', { title: 'Express' });
});

//Editar um Post --> tem de ser o dono
router.put('/:id', function(req, res, next) {
    res.render('index', { title: 'Express' });
});



//Comentario
router.post('/comentario', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//Comentarios de comentarios? IDK

//Apagar post --> Só pode se for o produtor
router.delete('/delete', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
