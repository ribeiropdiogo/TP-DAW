var express = require('express');
var router = express.Router();
var axios = require('axios');
const jwt = require('jsonwebtoken')
var fs = require('fs')
var JSZip = require("jszip");
var CryptoJS = require("crypto-js");

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

function getPath(str){
  var path = str.substring(0, 8) + '/' + str.substring(8, 16) + '/' + str.substring(16, 24) + '/' + str.substring(24, 32);
  return path;
}

// Formulário para adicionar um recurso
router.get('/novo', function(req, res) {
  
    let usrname = jwt.decode(req.cookies.token).username

    axios.get('http://localhost:7000/utilizadores/' + usrname + '?token=' + req.cookies.token)
        
        .then(resp => {

            axios.get('http://localhost:7000/tipos?token=' + req.cookies.token)
                .then(t => res.render('addRecurso', { title: 'Adicionar Recurso', nome: resp.data.nome, username: resp.data.username, instituicao: resp.data.instituicao, email: resp.data.email, tipos: t.data}))
                .catch(e => res.render('error', {error: e}));

        })
        .catch(err => {
            
            if(err.response.data.error.name == 'TokenExpiredError'){
                res.clearCookie("token")
                res.redirect('/login')
            }else{
                res.render('error', {error: err})
            }
        })
});



router.post('/', upload.single('conteudo'), function(req, res) {

  let path = __dirname + '/../' + req.file.path
  const FormData = require('form-data');

  const form = new FormData();
  form.append('conteudo', fs.createReadStream(path));

  const request_config = {
    headers: form.getHeaders(),
  };
  

  axios.post('http://localhost:7000/recursos?token=' + req.cookies.token, form, request_config)

      .then(resp => {
        fs.unlinkSync(path);
        res.status(201).jsonp(resp);
      })
      .catch(err => {
        res.render('error', {error: err})
        /*
        if(err.response.data.error.name == 'TokenExpiredError'){
            res.clearCookie("token")
            res.redirect('/login')
        }else{
            res.render('error', {error: err})
        }
        */
    })
});

router.get('/', function(req, res, next) {
    if(req.cookies.token != null){
        let usrname = jwt.decode(req.cookies.token).username
        let cond = "";

        if(req.query.tipo)
            cond = "tipo=" + req.query.tipo + "&"
        else if(req.query.username)
            cond = "username=" + req.query.username + "&"
        
        axios.get('http://localhost:7000/recursos?' + cond + 'token=' + req.cookies.token)
            .then(r => {
                axios.get('http://localhost:7000/utilizadores/' + usrname + '?token=' + req.cookies.token)
                    .then(resp => {
                        axios.get('http://localhost:7000/tipos/top/5?token=' + req.cookies.token)
                            .then(t => {
                                //res.cookie(req.cookies.token)
                                res.render('recursos', {title: 'RepositóriDOIS', nome: resp.data.nome, username: resp.data.username, instituicao: resp.data.instituicao, email: resp.data.email, tipos: t.data, recursos: r.data})
                            })
                            .catch(e => res.render('error', {error: e}))
                    })
                    .catch(err => res.render('error', {error: err}))
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

router.get('/zip/:id', function(req, res, next) {
    if(req.cookies.token != null){
        let usrname = jwt.decode(req.cookies.token).username

        var fid =  usrname + "_" + req.params.id;
        var path = __dirname + '/../downloads/' + fid + ".zip"
        
        axios.get('http://localhost:7000/recursos/zip/' + req.params.id + '?token=' + req.cookies.token, {responseType: 'stream'})
            .then(r => {
                // Recebe o zip e guarda na pasta
                r.data.pipe(fs.createWriteStream(path));

                r.data.on('end', function () {
                    fs.readFile(path, function(err, file) {
                        if (err) throw err
                        JSZip.loadAsync(file).then(function (zip) {
                            zip.generateAsync({type:"nodebuffer"})
                            .then(function(content) {
                                res.setHeader('Content-Type', 'application/octet-stream');
                                res.status(200).send(content)
                            });
                            //res.status(200).send(file);
                            fs.unlink(path, (err) => {
                                if (err) throw err
                            })
                        })
                    }) 
                });
                
            })
            .catch(err => {/*
                if(err.response.data.error.name == 'TokenExpiredError'){
                    res.clearCookie("token")
                    res.redirect('/login')
                }else{
                    res.render('error', {error: err})
                }*/
                res.render('error', {error: err})
            })

    } else {
        res.redirect('/login')
    }
});

router.get('/:id', function(req, res, next) {
    if(req.cookies.token != null){
        let usrname = jwt.decode(req.cookies.token).username
        let cond = "";
        
        axios.get('http://localhost:7000/recursos/' + req.params.id + '?token=' + req.cookies.token)
            .then(r => {
                axios.get('http://localhost:7000/utilizadores/' + usrname + '?token=' + req.cookies.token)
                    .then(resp => {
                        axios.get('http://localhost:7000/tipos/top/5?token=' + req.cookies.token)
                            .then(t => {
                                //res.cookie(req.cookies.token)
                                res.render('recurso', {title: r.data.titulo, nome: resp.data.nome, username: resp.data.username, instituicao: resp.data.instituicao, email: resp.data.email, tipos: t.data, recurso: r.data})
                            })
                            .catch(e => res.render('error', {error: e}))
                    })
                    .catch(err => res.render('error', {error: err}))
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


module.exports = router;
