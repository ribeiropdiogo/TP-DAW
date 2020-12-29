const express = require('express')
const router = express.Router()

/* ############################# */
/* Interface -> Comunicação com a API / Render dos templates
/* ############################# */

/* GET home page. */
router.get('/', verificaAutenticacao, function(req, res, next) {
    res.render('home', {title: 'RepositóriDOIS', nome: req.user.nome, username: req.user.username, instituicao: req.user.instituicao, email: req.user.email});
});

//Obter Lista de Posts dos users que subscreve
router.get('/feed', verificaAutenticacao, function(req, res, next) {
    res.render('home', {title: 'RepositóriDOIS', nome: req.user.nome, username: req.user.username, instituicao: req.user.instituicao, email: req.user.email});
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