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
router.get('/dados/:id', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//Registar novo utilziador
//Valida se é um email e se pwd tem pelo menos tamanho 5
router.post('/', [check('email').isEmail(), check('pass').isLength({ min: 5 })], function(req, res) {
    console.log(req.body);

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        //console.log(errors);
        return res.status(422).json({ errors: errors.array() })
    }
    
    axios.post('http://localhost:7000/utilizadores/', req.body)
        .then(resp => {
            res.jsonp(resp)
        })
        .catch(erro => {
            res.jsonp(erro)
        })
    
});


//Login
/*
router.post('/login', function(req, res) {
    
    //console.log(req.body);
    
    axios.post('http://localhost:7000/utilizadores/login', req.body)
        .then(resp => {
            console.log(resp.data)
            res.jsonp(resp.data)
        })
        .catch(erro => {
            res.jsonp(erro)
        })
    
});
*/

//Login -- Passport

router.post('/login', passport.authenticate('local'), function(req, res) {
        
    res.redirect("/feed")
    
});

//Logout
router.get('/logout', function(req, res){
    req.logout();
    req.session.destroy(function (err) {
      if (!err) {
          res.redirect('/');
      } else {
          console.log('Destroy session error: ', err)
      }
    });
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