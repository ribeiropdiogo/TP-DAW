const express = require('express')
var axios = require('axios');
const router = express.Router()
const jwt = require('jsonwebtoken')


/* ############################# */
/* Interface -> Comunicação com a API / Render dos templates
/* ############################# */

/* GET home page. */
router.get('/', function(req, res, next) {
    
    res.redirect('feed')

});

//Obter Lista de Posts dos users que subscreve
router.get('/feed', function(req, res) {
    
    if(req.cookies.token != null){

    var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}

        axios.get('http://localhost:7000/paginas/feed' , headers)
        
        .then(resp => {
            res.render('home', {title: 'RepositóriDOIS', nome: resp.data.user.nome, username: resp.data.user.username, instituicao: resp.data.user.instituicao, email: resp.data.user.email, tipos: resp.data.tipo})
        })

        .catch(err => {
            console.log(err.response.data.error.name)
            
            if(err.response.data.error.name == 'TokenExpiredError'){
                res.clearCookie("token")
                res.redirect('/login')
            }else{
                res.render('error', {error: err})
            }
        })

    }else{

        res.redirect('/login')
    }
    
  });



router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' })
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



module.exports = router