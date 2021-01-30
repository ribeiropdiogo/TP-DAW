const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')


var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var JSZip = require("jszip");
var fs = require('fs')
var CryptoJS = require("crypto-js");

const Recurso = require('../controllers/recurso')
const Tipo = require('../controllers/tipo')
const Utilizador = require('../controllers/utilizador')


function getPath(str){
    var path = str.substring(0, 6) + '/' + str.substring(6, 12) + '/' + str.substring(12, 18) + '/' + str.substring(18, 24);
    return path;
}



//######### FEED #############//

router.get('/feed', function(req, res) {

    let usrname = getUsername(req)
            
    Utilizador.lookup(usrname)
        .then(u => {

            //Listar o top 5 de Tipos
            Tipo.listTop(5)
                .then(t => { 

                    let data = {}

                    data.user = u
                    data.tipo = t

                    res.status(200).jsonp(data)    
                })
                .catch(error => res.status(500).jsonp(error)) 
        })
        .catch(erro => res.status(500).jsonp(erro))  
         

})


// ### MEUS RECURSOS ###//
router.get('/recursos', function(req, res) {

    let usrname = getUsername(req)

    if(req.query.tipo){
        Recurso.listByTipo(req.query.tipo)
            .then(r => {
                
                Utilizador.lookup(usrname)
                    .then(u => {

                        Tipo.listTop(req.query.n)
                            .then(t => { 

                                let data = {}

                                data.recurso = r
                                data.user = u
                                data.tipo = t
                                res.status(200).jsonp(data)
                        
                            })
                            .catch(error => res.status(500).jsonp(error))
                    })
                    .catch(erro => res.status(500).jsonp(erro))
            })
            .catch(error => res.status(500).jsonp(error))

    }
    else if(req.query.username){

        Recurso.listByUser(req.query.username)
        .then(r => {
            
            Utilizador.lookup(req.query.username)
                .then(u => {

                    Tipo.listTop(req.query.n)
                        .then(t => { 

                            let data = {}

                            data.recurso = r
                            data.user = u
                            data.tipo = t
                            res.status(200).jsonp(data)
                    
                        })
                        .catch(error => res.status(500).jsonp(error)) 
                })
                .catch(erro => res.status(500).jsonp(erro))
        })
        .catch(error => res.status(500).jsonp(error))

    }else{
        
        Recurso.list()
        .then(r => {
            
            Utilizador.lookup(usrname)
                .then(u => {

                    Tipo.listTop(req.query.n)
                        .then(t => { 

                            let data = {}

                            data.recurso = r
                            data.user = u
                            data.tipo = t
                            res.status(200).jsonp(data)
                    
                        })
                        .catch(error => res.status(500).jsonp(error))
            
                })
                .catch(erro => res.status(500).jsonp(erro))
        })
        .catch(error => res.status(500).jsonp(error))

    }

})

//######### Get Form Novo Recurso #############//

router.get('/recursos/novo', function(req, res) {

    let usrname = getUsername(req)

            
    Utilizador.lookup(usrname)
        .then(u => {

            Tipo.list()
                .then(t => { 

                    let data = {}

                    data.user = u
                    data.tipo = t

                    res.status(200).jsonp(data)    
                })
                .catch(error => res.status(500).jsonp(error)) 
        })
        .catch(erro => res.status(500).jsonp(erro))   

})


function getUsername(request){
    
    authHeader = request.headers['authorization']
    var myToken = authHeader && authHeader.split(' ')[1]

    let username = jwt.decode(myToken).username

    return username;
}


module.exports = router