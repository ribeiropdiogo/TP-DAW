const express = require('express')
const router = express.Router()

/* ############################# */
/* Interface -> Comunicação com a API / Render dos templates
/* ############################# */

/* GET home page. */
router.get('/', function(req, res, next) {
    //Quando vai para a /, verfica auth, se isAuth: True vai para o feed, else redirect login
    res.render('login', { title: 'Express' });
    //res.render('home', { title: 'RepositóriDOIS', nome: 'Gajo Fixe', email: 'gajo@fixe.com', instituicao: 'Universidade do Minho' });
});

//Obter Lista de Posts dos users que subscreve
router.get('/feed', verificaAutenticacao, function(req, res, next) {
    res.render('test', {utilizador: req.user.username});
});

router.get('/login', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.render('login', { title: 'Login' })
});

router.get('/logout', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.render('index')
});

router.get('/registo', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.render('registo')
});

router.post('/login', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.render('registo')
});

router.post('/registo', function(req, res, next) {
    //res.render('index', { title: 'Express' });
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