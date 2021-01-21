var express = require('express');
var router = express.Router();
var axios = require('axios');


// Formulário para adicionar um recurso
router.get('/novo', verificaAutenticacao ,function(req, res) {
  axios.get('http://localhost:7000/tipos')
        .then(t => res.render('addRecurso', { title: 'Adicionar Recurso', nome: req.user.nome, username: req.user.username, instituicao: req.user.instituicao, email: req.user.email, tipos: t.data}))
        .catch(e => res.render('error', {error: e}));
});

router.post('/', function(req, res) {
  axios.post('http://localhost:7000/recursos', req.body)
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
