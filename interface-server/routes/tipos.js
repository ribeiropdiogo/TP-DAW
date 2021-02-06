var express = require('express');
var router = express.Router();
var axios = require('axios');
const jwt = require('jsonwebtoken')


// Formulário para adicionar um tipo
router.get('/novo', function(req, res) {
  
    var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}

    axios.get('http://localhost:7000/recursos/novo', headers)
        .then(resp => {

            console.log(resp.data)
            res.render('addTipo', { title: 'Adicionar Tipo', nome: resp.data.user.nome, instituicao: resp.data.user.instituicao, email: resp.data.user.email, tipos: resp.data.tipo});
        
        })
        .catch(e => res.render('error', {error: e}))
});



router.post('/', function(req, res) {

    req.body.token = req.cookies.token

    axios.post('http://localhost:7000/tipos', req.body)
        .then(resp => {
            res.status(201).jsonp(resp)
        })
        .catch(erro => {
            res.jsonp(erro)
        })
});



module.exports = router;
