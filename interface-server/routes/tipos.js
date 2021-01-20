var express = require('express');
var router = express.Router();
var axios = require('axios');


// Formulário para adicionar um tipo
router.get('/novo', verificaAutenticacao ,function(req, res) {
    res.render('addTipo', { title: 'Adicionar Tipo', nome: req.user.nome, username: req.user.username, instituicao: req.user.instituicao, email: req.user.email});
});

router.post('/', function(req, res) {
  console.log(req.body)
  axios.post('http://localhost:7000/tipos', req.body)
      .then(resp => {
          res.status(201).jsonp(resp)
      })
      .catch(erro => {
          res.jsonp(erro)
      })
  
});

function verificaAutenticacao(req, res, next){
    if(req.isAuthenticated())
      next();
    else 
        res.redirect("/login"); 
}

module.exports = router;
