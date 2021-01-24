var express = require('express');
var router = express.Router();
var axios = require('axios');
const jwt = require('jsonwebtoken')


// Formulário para adicionar um recurso
router.get('/novo', function(req, res) {
  
    let usrname = jwt.decode(req.cookies.token).username

    axios.get('http://localhost:7000/utilizadores/' + usrname + '?token=' + req.cookies.token)
        
        .then(resp => {

            axios.get('http://localhost:7000/tipos?token=' + req.cookies.token)
                .then(t => res.render('addRecurso', { title: 'Adicionar Recurso', nome: resp.data.nome, username: resp.data.username, instituicao: resp.data.instituicao, email: resp.data.email, tipos: t.data}))
                .catch(e => res.render('error', {error: e}));

        })
        .catch(e => res.render('error', {error: e}))
});



router.post('/', function(req, res) {

    req.body.token = req.cookies.token
    
    axios.post('http://localhost:7000/recursos', req.body)
        .then(resp => {
            res.status(201).jsonp(resp)
        })
        .catch(erro => {
            res.jsonp(erro)
        })
});


module.exports = router;
