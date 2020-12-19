var express = require('express');
var router = express.Router();

var Post = require('../controllers/post')

router.get('/', function(req, res) {
    res.jsonp("post works")
    // Data Retrieve 
    //promessa
    /*
    Post.list()
        .then(data => res.render('index', { list: data}))
        .catch(err => res.render('error', {error: err}));
    */
    });


// Get post details
router.get('/:id', function(req, res) {
    Post.lookup(id)
      .then(data => res.render('index',{post: data}))
      .catch(err => res.render('error',{error: err}))
});

//Get Comentários de um post especifico
router.get('/:id/comentarios', function(req, res) {
    res.render(index);
});


//Add post  
router.post('/', function(req, res) {

    var info = req.body

    Post.insert(info)
        .then(data => res.render('index',{post: data}))
        .catch(err => res.render('error',{error: err}))

});


//Post Comentários
//Fazer Igual para os Likes ? 
router.post('/:id/comentarios', function(req, res) {
    res.render(index);
});


//Get post Edit Form
router.get('/edit/:id', function(req, res) {
    var id = req.url.split("/")[2]

    Post.lookup(id)
      .then(data => res.render('edit',{post: data}))
      .catch(err => res.render('error',{error: err}))
  });


//Update post

router.put('/edit', function(req, res) {

    var info = req.body
    
    Post.edit(info)
      .then(data => res.render('post',{post: data}))
      .catch(err => res.render('error',{error: err}))
  });


// Delete post
router.get('/:id', function(req, res) {

    var id = req.url.split("/")[2]

    Post.remove(id)
      .then(data => {
          Post.list()
          .then(data => res.render('index', { list: data}))
          .catch(err => res.render('error', {error: err}));
      })   
      .catch(err => res.render('error', {error: err}))
  });



  module.exports = router;