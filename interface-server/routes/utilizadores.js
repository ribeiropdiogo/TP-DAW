var express = require('express');
var router = express.Router();

//Route para o Utilizador obter uma lista de todos os users na plataforma 
//Pode ver todos ou só os que são produtores ?  
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Works' });
});

//Obter detalhes pessoais
router.get('/:id', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//Editar dados
router.put('/editar', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//Apagar conta
router.delete('/delete', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;