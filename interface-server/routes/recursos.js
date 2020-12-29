var express = require('express');
var router = express.Router();


// Formulário para adicionar um recurso
router.get('/novo', verificaAutenticacao ,function(req, res) {
    res.render('addRecurso', { title: 'Adicionar Recurso', nome: req.user.nome, username: req.user.username, instituicao: req.user.instituicao, email: req.user.email});
});

function verificaAutenticacao(req, res, next){
    if(req.isAuthenticated())
      next();
    else 
        res.redirect("/login"); 
}

module.exports = router;
