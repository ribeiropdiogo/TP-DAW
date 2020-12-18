var express = require('express');
var router = express.Router();

/* ############################# */
/* Interface -> Comunicação com a API / Render dos templates
/* ############################# */

/* GET home page. */
router.get('/', function(req, res, next) {
    //Quando vai para a /, verfica auth, se isAuth: True vai para o feed, else redirect login
    res.render('index', { title: 'Express' });
});

//Obter Lista de Posts dos users que subscreve
router.get('/feed', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.render('index')
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

module.exports = router;
