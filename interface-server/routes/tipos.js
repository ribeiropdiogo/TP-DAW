var express = require('express');
var router = express.Router();
var axios = require('axios');
const jwt = require('jsonwebtoken')


// Formulário para adicionar um tipo
router.get('/novo', function(req, res) {
  
    var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}
    let usrname = jwt.decode(req.cookies.token).username

    axios.get('http://localhost:7000/utilizadores/' + usrname, headers)
        .then(resp => {

            console.log(resp.data)
            res.render('addTipo', { title: 'Adicionar Tipo', nome: resp.data.nome, username: resp.data.username, instituicao: resp.data.instituicao, email: resp.data.email});
        
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
