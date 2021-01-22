var express = require('express');
var router = express.Router();
var axios = require('axios');
var fs = require('fs')

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

function getPath(str){
  var path = str.substring(0, 8) + '/' + str.substring(8, 16) + '/' + str.substring(16, 24) + '/' + str.substring(24, 32);
  return path;
}

// Formulário para adicionar um recurso
router.get('/novo', verificaAutenticacao ,function(req, res) {
  axios.get('http://localhost:7000/tipos')
        .then(t => res.render('addRecurso', { title: 'Adicionar Recurso', nome: req.user.nome, username: req.user.username, instituicao: req.user.instituicao, email: req.user.email, tipos: t.data}))
        .catch(e => res.render('error', {error: e}));
});

router.post('/', upload.single('conteudo'), function(req, res) {

  let path = __dirname + '/../' + req.file.path
  const FormData = require('form-data');

  const form = new FormData();
  form.append('conteudo', fs.createReadStream(path));

  const request_config = {
    headers: form.getHeaders()
  };

  axios.post('http://localhost:7000/recursos', form, request_config)
      .then(resp => {
        fs.unlinkSync(path);
        res.status(201).jsonp(resp);
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
