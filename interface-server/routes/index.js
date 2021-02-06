const express = require('express')
var axios = require('axios');
const router = express.Router()
const jwt = require('jsonwebtoken')
var passport = require('passport')

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
        let usrname = jwt.decode(req.cookies.token).username

        axios.get('http://localhost:7000/utilizadores/' + usrname, headers)
        .then(user => {
            axios.get('http://localhost:7000/tipos/top/5', headers)
            .then(tipos => {
                axios.get('http://localhost:7000/posts', headers)
                .then(posts => {
                    res.render('home', {title: 'RepositoriDOIS', user: user.data, tipos: tipos.data, posts: posts.data})
                })
                .catch(e => res.render('error', {error: e}))
            })
            .catch(e => res.render('error', {error: e}))
        })
        .catch(e => {
            console.log(e.response.data.error.name)
            
            if(e.response.data.error.name == 'TokenExpiredError'){
                res.clearCookie("token")
                res.redirect('/login')
            }else{
                res.render('error', {error: e})
            }
        })
    } else {
        res.redirect('/login')
    }
  });

router.get('/estatisticas', function(req, res) {
  
    if(req.cookies.token != null){
            var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}
            let username = jwt.decode(req.cookies.token).username
    
            axios.get('http://localhost:7000/utilizadores/' + username, headers)
            .then(resp => {
                if(resp.data.admin == true){
                    axios.get('http://localhost:7000/tipos/', headers)
                    .then(t => {
                        axios.get('http://localhost:7000/recursos/estatisticas', headers)
                        .then(estatisticas => {
                            res.render('stats', {title: 'RepositóriDOIS', stats: estatisticas.data, tipos: t.data})
                        })
                        .catch(e => res.render('error', {error: e}))
                    })
                    .catch(e => res.render('error', {error: e}))
                } else {
                    res.redirect('/feed')
                }
            })
            .catch(err => {
                if(err.response.data.error.name == 'TokenExpiredError'){
                    res.clearCookie("token")
                    res.redirect('/login')
                }else{
                    res.render('error', {error: err})
                }
            })
        } else {
            res.redirect('/login')
        }
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' })
});

router.get('/recuperaPassword', function(req, res, next){
    res.render('recoverPassword', { title: 'Recuperar Password' })
})


router.get('/redefinePassword/:token', function(req, res, next) {
    res.render('resetPassword', { title: 'Recuperar Password' })
});


//Google OAuth
router.get('/googleAuth', passport.authenticate('google', { scope: ['profile', 'email'] }));

//Facebook OAuth
router.get('/facebookAuth', passport.authenticate('facebook', { scope : ['email'] }));

router.get('/admin', function(req, res, next) {
    if(req.cookies.token != null){
            var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}
            let username = jwt.decode(req.cookies.token).username
    
            axios.get('http://localhost:7000/utilizadores/' + username, headers)
            .then(resp => {
                if(resp.data.admin == true){
                    axios.get('http://localhost:7000/tipos/top/5', headers)
                    .then(t => {
                        res.render('admin', {title: 'RepositoriDOIS', nome: resp.data.nome, username: resp.data.username, instituicao: resp.data.instituicao, email: resp.data.email, tipos: t.data})
                    })
                    .catch(e => res.render('error', {error: e}))
                } else {
                    res.redirect('/feed')
                }
            })
            .catch(err => {
                if(err.response.data.error.name == 'TokenExpiredError'){
                    res.clearCookie("token")
                    res.redirect('/login')
                }else{
                    res.render('error', {error: err})
                }
            })
        } else {
            res.redirect('/login')
        }
});



module.exports = router