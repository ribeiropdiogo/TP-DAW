var express = require('express');
var router = express.Router();
var axios = require('axios');
const { check, validationResult } = require('express-validator');
var passport = require('passport')

//Route para o Utilizador obter uma lista de todos os users na plataforma 
//Pode ver todos ou só os que são produtores ?  
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Works' });
});

//Obter detalhes pessoais
router.get('/:id', function(req, res, next) {
    var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}

    if(req.cookies.token != null){

        axios.get('http://localhost:7000/utilizadores/detalhes/' + req.params.id, headers)
            .then(resp => {
                console.log(resp.data)
                res.render('utilizador', {title: 'RepositóriDOIS', nome: resp.data.user.nome, username: resp.data.user.username, instituicao: resp.data.user.instituicao, email: resp.data.user.email, tipos: resp.data.tipo, recursos: resp.data.recursos, owner: resp.data.owner})
            })
            .catch(err => {
                res.render('error', {error: err})
            })
    } else {
        res.redirect('/login')
    }
});

//Registar novo utilziador
//Valida se é um email e se pwd tem pelo menos tamanho 5
router.post('/', [check('email').isEmail(), check('password').isLength({ min: 5 })], function(req, res) {
    console.log(req.body);

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        //console.log(errors);
        return res.status(422).json({ errors: errors.array() })
    }
    
    axios.post('http://localhost:6000/utilizadores/', req.body)
        .then(resp => {
            res.jsonp(resp)
        })
        .catch(erro => {
            res.jsonp(erro)
        })
    
});

//Login
router.post('/login', function(req, res) {
    axios.post('http://localhost:6000/utilizadores/login', req.body)
      .then(resp => {
        res.cookie('token', resp.data.token, {
          expires: new Date(Date.now() + '1h'),
          secure: false, 
          httpOnly: true
        });
        res.redirect('/feed')
        //res.redirect('/feed').send() -- ver
    })
      .catch(e => res.render('error', {error: e}))
  });



//Logout --> Tem que se adicionar os tokens a uma BLACKLIST
router.get('/logout', function(req, res) {

    req.body.token = req.cookies.token
    req.body.blacklist = true

    axios.post('http://localhost:7000/logout', req.body)
    .then(resp => {
        res.clearCookie("token")
        res.redirect('/login')
      })
    .catch(e => res.render('error', {error: e}))
});


//Editar dados
router.put('/editar', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//Apagar conta
router.delete('/delete', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;