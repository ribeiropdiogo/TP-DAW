var express = require('express');
var router = express.Router();
var axios = require('axios');
const { check, validationResult } = require('express-validator');
var passport = require('passport')

//Route para o Utilizador obter uma lista de todos os users na plataforma 
//Pode ver todos ou só os que são produtores ?  
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Works', footer: true });
});

//Registar novo utilziador
//Valida se é um email e se pwd tem pelo menos tamanho 5
router.post('/', [check('email').isEmail(), check('password').isLength({ min: 5 })], function(req, res) {

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
    })
      .catch(e => res.render('error', {error: e, footer: false}))
  });


  //Gerar resetToken
router.post('/recuperaPassword', function(req, res) {
    axios.post('http://localhost:6000/utilizadores/recuperaPassword', req.body)
      .then(resp => {
        res.status(200).jsonp(resp);
    })
      .catch(e => res.render('error', {error: e, footer: false}))
  });


//Definir Nova Password
router.post('/redefinePassword', [check('newPassword').isLength({ min: 5 })], function(req, res) {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    axios.post('http://localhost:6000/utilizadores/redefinePassword/', req.body)
    .then(resp => {
        res.cookie('token', resp.data.token, {
          expires: new Date(Date.now() + '1h'),
          secure: false, 
          httpOnly: true
        });
        res.redirect('/feed')
    })
    .catch(err => {
        if(err.response.status==401){
            res.status(401).jsonp("Problema com o Token");
        }else{
            res.render('error', {error: err, footer: false}) 
        }
    })
  });


//Google OAuth Callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {

    req.body.userData = req.user
    
    axios.post('http://localhost:6000/utilizadores/googleAuth', req.body)
    .then(resp => {
        res.cookie('token', resp.data.token, {
          expires: new Date(Date.now() + '1h'),
          secure: false, 
          httpOnly: true
        });
        res.redirect('/feed')
    })
    .catch(err => {
        if(err.response.status==401){
            res.status(401).jsonp("Problema com o Token");
        }else if(err.response.status==404){
            res.render('registerOAuth', { title: 'Registo', user: req.user.profile._json})
        }else{
            res.render('error', {error: err}) 
        }
    })

});


//Facebook OAuth Callback
router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {

    req.body.userData = req.user
    //console.log(req.body.userData.profile.emails[0].value)
    
    axios.post('http://localhost:6000/utilizadores/facebookAuth', req.body)
    .then(resp => {
        res.cookie('token', resp.data.token, {
          expires: new Date(Date.now() + '1h'),
          secure: false, 
          httpOnly: true
        });
        res.redirect('/feed')
    })
    .catch(err => {
        if(err.response.status==401){
            res.status(401).jsonp("Problema com o Token");
        }else if(err.response.status==404){

            var render = {}
            render.email = req.user.profile._json.email
            render.name = '' + req.user.profile._json.first_name + ' ' + req.user.profile._json.last_name
            res.render('registerOAuth', { title: 'Registo', user: render})
        }else{
            res.render('error', {error: err}) 
        }
    })

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
    .catch(e => res.render('error', {error: e, footer: false}))
});


//Editar dados
router.put('/editar', function(req, res, next) {
    res.render('index', { title: 'Express', footer: false });
});

//Apagar conta
router.delete('/delete', function(req, res, next) {
    res.render('index', { title: 'Express', footer: false });
});

//Obter detalhes pessoais
router.get('/:id', function(req, res, next) {
    var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}

    if(req.cookies.token != null){

        axios.get('http://localhost:7000/utilizadores/detalhes/' + req.params.id, headers)
            .then(resp => {
                res.render('utilizador', {title: 'RepositóriDOIS', user: resp.data.user, tipos: resp.data.tipo, recursos: resp.data.recursos, owner: resp.data.owner, footer: true})
            })
            .catch(err => {
                res.render('error', {error: err, footer: false})
            })
    } else {
        res.redirect('/login')
    }
});

module.exports = router;