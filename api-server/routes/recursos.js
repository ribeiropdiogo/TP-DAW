const express = require('express')
const router = express.Router()

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var JSZip = require("jszip");
var fs = require('fs')
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken')

const Recurso = require('../controllers/recurso')
const Tipo = require('../controllers/tipo')

function getPath(str){
    var path = str.substring(0, 6) + '/' + str.substring(6, 12) + '/' + str.substring(12, 18) + '/' + str.substring(18, 24);
    return path;
}

function filterResources(data,query_user){
    var i;
    var response = [];
    for (i = 0; i < data.length; i++) {
        if(data[i].visibilidade == "Público" || data[i].autor == query_user)
            response.push(data[i]);
    } 
    return response;
}

// GET /recursos
router.get('/', function(req, res) {

    var myToken = req.query.token || req.body.token
    var query_user = jwt.decode(myToken).username

    if(req.query.tipo){
        Recurso.listByTipo(req.query.tipo)
            .then(data => { res.status(200).jsonp(filterResources(data,query_user))})
            .catch(error => res.status(500).jsonp(error))
    } else if(req.query.username){
        Recurso.listByUser(req.query.username)
            .then(data => res.status(200).jsonp(filterResources(data,query_user)))
            .catch(error => res.status(500).jsonp(error))
    } else {
        Recurso.list()
            .then(data => res.status(200).jsonp(filterResources(data,query_user)))
            .catch(error => res.status(500).jsonp(error))
    }
})

// GET /recursos/:id
router.get('/:id', function(req, res) {

    var myToken = req.query.token || req.body.token
    var query_user = jwt.decode(myToken).username

    Recurso.lookup(req.params.id)
        .then(data => {
            if(data.autor == query_user || data.visibilidade == "Público")
                res.status(200).jsonp(data)
            else 
                res.status(401).jsonp()
        })
        .catch(error => res.status(500).jsonp(error))
})

// GET /recursos/:id
router.get('/zip/:id', function(req, res) {
    var path = __dirname + '/../recursos/' + getPath(req.params.id);

    Recurso.lookup(req.params.id)
        .then(meta => {
            path = path + '/' + meta.nome

            fs.readFile(path, function (err,readStream) {
                var zip = new JSZip();
                // bagit
                zip.file(
                    "bagit.txt", 
                    "(BagIt-version: 1.0 )\n(Tag-File-Character-Encoding: UTF-8)\n");
                // metadata
                zip.file(
                    "metadata.json", 
                    JSON.stringify(meta, null, 3));
                // payload
                var data = zip.folder("data");
                data.file(meta.nome, readStream, {base64: true});
                // manifest
                var file_wordArr = CryptoJS.lib.WordArray.create(readStream);
                var sha256_hash = CryptoJS.SHA256(file_wordArr);
                zip.file(
                    "manifest-sha256.txt", 
                    "(" + sha256_hash.toString() + " data/" + meta.nome + ")\n");

                zip.generateAsync({type:"nodebuffer"})
                    .then(function(content) {
                        res.setHeader('Content-Type', 'application/octet-stream');
                        res.status(200).send(content)
                    });
            });
        })
})

// POST /recursos
router.post('/', upload.single('conteudo'), function(req, res) {

    let path = __dirname + '/../' + req.file.path
    let npath = __dirname + '/../' + req.file.path + '.zip'
    
    fs.rename(path, npath, function(err) {
        if (err) throw err
        fs.readFile(npath, function(err, data) {
            if (err) throw err
            JSZip.loadAsync(data).then(function (zip) {
                var metadados = zip.file("metadata.json").async("string");
                metadados.then(function(result) {
                    // Deconstruct metadata and add creation time
                    var meta = JSON.parse(result); 

                    meta.dataRegisto = new Date().toISOString().slice(0,19);

                    var payload = zip.file("data/"+meta.nome).async("nodebuffer")

                    payload.then(function(p) {

                        let fpath = __dirname + '/../' + 'recursos/' + meta.nome
                        fs.writeFileSync(fpath, p,'binary')

                        var file_wordArr = CryptoJS.lib.WordArray.create(fs.createReadStream(fpath));
                        var sha256_hash = CryptoJS.SHA256(file_wordArr);

                        var hash = zip.file("manifest-sha256.txt").async("string");
                        hash.then(function(line){
                            // Validate checksums
                            const r = line.split(' ')[0];
                            if(sha256_hash.toString() != r.substring(1)){
                                console.log("> Invalid SIP: Checksum comparison failed")
                                res.status(500).send("Invalid Checksum")
                            } else {
                                Recurso.insert(meta)
                                    .then(data => { 
                                        var newPath = __dirname + '/../' + 'recursos/' + getPath(data._id.toString()) + '/' + meta.nome;
                                        
                                        // Create path if not exists
                                        if (!fs.existsSync(__dirname + '/../' + 'recursos/' + getPath(data._id.toString()))){
                                            fs.mkdirSync(
                                                __dirname + '/../' + 'recursos/' + getPath(data._id.toString()), 
                                                { recursive: true }
                                            );
                                        }
                                        
                                        // Move file to storage tree
                                        fs.rename(fpath, newPath, function(err) {
                                            if (err) console.log(err)
                                        })

                                        fs.unlink(npath, (err) => {
                                            if (err) throw err
                                        })
                                        
                                        Tipo.increment(meta.tipo)
                                        .then(
                                            res.status(201).jsonp(data)
                                        )
                                        .catch(error => console.log(error))
                                    })
                                    .catch(error => res.status(500).jsonp(error))
                            }
                        })
                    });
                });
            });
        });
    })
})

// PUT /recursos/:id
router.put('/:id', function(req, res) {

    var myToken = req.query.token || req.body.token
    var query_user = jwt.decode(myToken).username

    Recurso.lookup(req.params.id)
        .then(data => {
            if(data.autor == query_user){
                Recurso.edit(req.params.id, req.body)
                    .then(data => res.status(200).jsonp(data))
                    .catch(error => res.status(500).jsonp(error))
            } else
                res.status(401).jsonp()
        })
        .catch(error => res.status(500).jsonp(error))
})

// DELETE /recursos/:id
router.delete('/:id', function(req, res) {

    var myToken = req.query.token || req.body.token
    var query_user = jwt.decode(myToken).username

    Recurso.lookup(req.params.id)
        .then(data => {
            if(data.autor == query_user){
                Recurso.remove(req.params.id)
                    .then(r => {
                        let path = __dirname + '/../' + 'recursos/' + getPath(data._id.toString()) + "/" + data.nome
                        console.log(path)
                        fs.unlink(path, (err) => {
                            if (err) throw err
                        })
                        Tipo.decrement(data.tipo)
                            .then(res.status(200).jsonp(data))
                            .catch(error => console.log(error))
                    })
                    .catch(error => res.status(500).jsonp(error))
            } else
                res.status(401).jsonp()
        })
        .catch(error => res.status(500).jsonp(error))
    
})

module.exports = router
