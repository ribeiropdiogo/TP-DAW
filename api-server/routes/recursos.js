const express = require('express')
const router = express.Router()

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var JSZip = require("jszip");
var fs = require('fs')
var CryptoJS = require("crypto-js");

const Recurso = require('../controllers/recurso')

function getPath(str){
    var path = str.substring(0, 6) + '/' + str.substring(6, 12) + '/' + str.substring(12, 18) + '/' + str.substring(18, 24);
    return path;
}

// GET /recursos
router.get('/', function(req, res) {
    Recurso.list()
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// GET /recursos/:id
router.get('/:id', function(req, res) {
    Recurso.lookup(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
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

                    var payload = zip.file("data/"+meta.nome).async("string")

                    payload.then(function(p) {

                        let fpath = __dirname + '/../' + 'recursos/' + meta.nome
                        fs.writeFileSync(fpath, p)

                        var file_wordArr = CryptoJS.lib.WordArray.create(fs.createReadStream(fpath));
                        var sha256_hash = CryptoJS.SHA256(file_wordArr);

                        var hash = zip.file("manifest-sha256.txt").async("string");
                        hash.then(function(line){
                            // Validate checksums
                            const r = line.split(' ')[0];
                            if(sha256_hash.toString() != r.substring(1))
                                console.log("> Invalid SIP: Checksum comparison failed")
                            else {
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

                                        res.status(201).jsonp(data)
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
    Recurso.edit(req.params.id, req.body)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// DELETE /recursos/:id
router.delete('/:id', function(req, res) {
    Recurso.remove(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

module.exports = router
