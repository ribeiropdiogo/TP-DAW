var express = require('express');
var router = express.Router();

var Utilizador = require('../controllers/utilizador')

router.get('/', function(req, res) {
    res.jsonp("API User's good.")
    // Data Retrieve 
    //promessa
    /*
    Utilizador.list()
        .then(data => res.render('index', { list: data}))
        .catch(err => res.render('error', {error: err}));*/
  });


// Get user
router.get('/:id', function(req, res) {
    res.jsonp("workz")
    Utilizador.lookup(id)
      .then(data => res.render('index',{utilizador: data}))
      .catch(err => res.render('error',{error: err}))
  });


//Add User  
router.post('/', function(req, res) {
    var info = req.body
    info.admin = false;
    Utilizador.insert(info)
        .then(data => res.jsonp(data))
        .catch(err => res.jsonp(err))
});


//Get user Edit Form
router.get('/edit/:id', function(req, res) {
    var id = req.url.split("/")[2]

    Utilizador.lookup(id)
      .then(data => res.render('edit',{utilizador: data}))
      .catch(err => res.render('error',{error: err}))
});


//Update user

router.put('/edit', function(req, res) {

    var info = req.body
    
    Utilizador.edit(info)
      .then(data => res.render('utilizador',{utilizador: data}))
      .catch(err => res.render('error',{error: err}))
  });


// Delete user
router.get('/delete/:id', function(req, res) {

    var id = req.url.split("/")[2]

    Utilizador.remove(id)
      .then(data => {
          Utilizador.list()
          .then(data => res.render('index', { list: data}))
          .catch(err => res.render('error', {error: err}));
      })   
      .catch(err => res.render('error', {error: err}))
  });

module.exports = router;