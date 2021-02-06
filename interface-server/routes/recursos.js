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
  
    var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}

    axios.get('http://localhost:7000/recursos/novo', headers)
        
        .then(resp => {

            res.render('addRecurso', { title: 'Adicionar Recurso', nome: resp.data.user.nome, username: resp.data.user.username, instituicao: resp.data.user.instituicao, email: resp.data.user.email, tipos: resp.data.tipo})
        })
        .catch(err => {
            if(err.response.status == 401){
                res.clearCookie("token")
                res.redirect('/login')
            }else{
                res.render('error', {error: err})
            }
        })
});


//POST RECURSO //
router.post('/', upload.single('conteudo'), function(req, res) {

    let path = __dirname + '/../' + req.file.path
    const FormData = require('form-data');

    const form = new FormData();
    form.append('conteudo', fs.createReadStream(path));

    //request_config alterado
    const headers = {headers: {
        'Content-Type': form.getHeaders()['content-type'],
        'Authorization':  `Bearer ${req.cookies.token}`
    }}
  

    axios.post('http://localhost:7000/recursos', form, headers)

        .then(resp => {
            fs.unlinkSync(path);
            res.status(201).jsonp(resp.data);
        })
        .catch(err => {
            if(err.response.status==401){
                res.status(401).jsonp("Token Expirado!");
            }else{
                res.render('error', {error: err}) 
            }
        })
});



//GET Recursos
router.get('/', function(req, res, next) {

    var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}

    if(req.cookies.token != null){

        let cond = "";

        if(req.query.tipo)
            cond = "tipo=" + req.query.tipo + "&"
        else if(req.query.username)
            cond = "username=" + req.query.username + "&"
        else if(req.query.tag)
            cond = "tag=" + req.query.tag + "&"
        

        axios.get('http://localhost:7000/recursos?' + cond + 'n=5', headers)
            .then(resp => {
                res.render('recursos', {title: 'RepositóriDOIS', nome: resp.data.user.nome, username: resp.data.user.username, instituicao: resp.data.user.instituicao, email: resp.data.user.email, tipos: resp.data.tipo, recursos: resp.data.recurso})

            })
            .catch(err => {
                //Se for código 401 / Aqui vai ser obrigatoriamente por ter expirado, já se verificou se existe
                if(err.response.status == 401){
                    res.clearCookie("token")
                    res.redirect('/login')
                }else{
                    res.render('error', {error: err})
                }
            })

        /*
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
            */

    } else {
        res.redirect('/login')
    }
});

router.get('/zip/:id', function(req, res, next) {
    if(req.cookies.token != null){

        var req_config = { headers: { Authorization: `Bearer ${req.cookies.token}` }, responseType: 'stream'}
        
        let usrname = jwt.decode(req.cookies.token).username

        var fid =  usrname + "_" + req.params.id;
        var path = __dirname + '/../downloads/' + fid + ".zip"
        
        axios.get('http://localhost:7000/recursos/zip/' + req.params.id, req_config)

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
            .catch(err => {
                if(err.response.status == 401){
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


router.get('/meta/:id', function(req, res, next) {
    if(req.cookies.token != null){

        var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}
        
        axios.get('http://localhost:7000/recursos/' + req.params.id, headers)
            .then(r => {
                res.status(200).send(r.data)
            })
            .catch(err => {
                if(err.response.status == 401){
                    res.clearCookie("token")
                    res.redirect('/login')
                }else{
                    res.render('error', {error: err})
                }
            })

    } else {
        res.redirect('/login')
    }
})


router.get('/:id', function(req, res, next) {
    if(req.cookies.token != null){

        let username = jwt.decode(req.cookies.token).username
        var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}
        
        axios.get('http://localhost:7000/recursos/' + req.params.id, headers)
            .then(r => {
                axios.get('http://localhost:7000/utilizadores/' + username, headers)
                    .then(resp => {
                        axios.get('http://localhost:7000/tipos/top/5', headers)
                            .then(t => {
                                res.render('recurso', {title: r.data.titulo, user: resp.data, tipos: t.data, recurso: r.data})
                            })
                            .catch(e => res.render('error', {error: e}))
                    })
                    .catch(err => res.render('error', {error: err}))
            })
            .catch(err => {
                if(err.response.status == 401){
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

// DELETE /recursos/:id
router.delete('/:id', function(req, res) {

    var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}

    axios.delete('http://localhost:7000/recursos/' + req.params.id, headers)
        .then(resp => {
            res.status(200).jsonp()
        })
        .catch(error => {
            if(error.response.status==401){
                res.clearCookie("token")
                res.status(401).jsonp("Token Expirado!");
            }else{
                res.status(500).jsonp(error)
            } 
        })
})


// ADD|REMOVE STAR //
router.put('/star/:id', function(req, res) {
    if(req.cookies.token != null){

        var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}

        axios.put('http://localhost:7000/recursos/star/' + req.params.id,{}, headers)
            .then(r => {
                res.status(201).send();
            })
            .catch(err => {
                if(err.response.status == 401){
                    res.clearCookie("token")
                    res.status(401).jsonp("Token Expirado!");
                }else{
                    res.render('error', {error: err})
                }
            })
    }
})

//GET FORM EDITAR
router.get("/editar/:id", function (req, res) {
    if(req.cookies.token != null){
        
        let usrname = jwt.decode(req.cookies.token).username
        var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}
        
                axios.get('http://localhost:7000/utilizadores/' + usrname, headers)
                    .then(resp => {
                        axios.get('http://localhost:7000/tipos/top/5', headers)
                            .then(t => {
                                //res.cookie(req.cookies.token)
                                res.render('editRecurso', {title: "Editar Recurso", nome: resp.data.nome, username: resp.data.username, instituicao: resp.data.instituicao, email: resp.data.email, tipos: t.data})
                            })
                            .catch(e => {
                                res.render('error', {error: e})
                            })
                    })
                    .catch(err => {
                        if(err.response.status == 401){
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


//UPDATE RECURSO
router.put("/:id", function (req, res) {
    if(req.cookies.token != null){

        var headers = { headers: { Authorization: `Bearer ${req.cookies.token}` }}

        axios.put('http://localhost:7000/recursos/' + req.params.id, req.body, headers)
                .then(resp => {
                    res.status(200).jsonp()
                })
                .catch(err => {
                    if(err.response.status==401){
                        res.clearCookie("token")
                        res.status(401).jsonp("Token Expirado!");
                    }else{
                        res.render('error', {error: err}) 
                    }                
                })
    } else {
        res.redirect('/login')
    }
});

module.exports = router;