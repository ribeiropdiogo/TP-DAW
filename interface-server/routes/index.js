const express = require('express')
var axios = require('axios');
const router = express.Router()

/* ############################# */
/* Interface -> Comunicação com a API / Render dos templates
/* ############################# */

/* GET home page. */
router.get('/', verificaAutenticacao, function(req, res, next) {
    axios.get('http://localhost:7000/tipos/top/5')
        .then(t => res.render('home', {title: 'RepositóriDOIS', nome: req.user.nome, username: req.user.username, instituicao: req.user.instituicao, email: req.user.email, tipos: t.data}))
        .catch(e => res.render('error', {error: e}));
});

//Obter Lista de Posts dos users que subscreve
router.get('/feed', verificaAutenticacao, function(req, res, next) {
    axios.get('http://localhost:7000/tipos/top/5')
        .then(t => res.render('home', {title: 'RepositóriDOIS', nome: req.user.nome, username: req.user.username, instituicao: req.user.instituicao, email: req.user.email, tipos: t.data}))
        .catch(e => res.render('error', {error: e}));
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' })
});

router.get('/logout', function(req, res, next) {
    res.render('login', { title: 'Bem-Vindo' });
});

router.get('/registo', function(req, res, next) {
    res.render('registo')
});

router.post('/login', function(req, res, next) {
    res.render('registo')
});

router.post('/registo', function(req, res, next) {
    res.render('registo')
});


function verificaAutenticacao(req, res, next){
    if(req.isAuthenticated()){
    //req.isAuthenticated() will return true if user is logged in
      next();
    } else{
    res.redirect("/login");}
  }

module.exports = router