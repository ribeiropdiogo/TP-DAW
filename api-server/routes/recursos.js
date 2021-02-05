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
const Utilizador = require('../controllers/utilizador');

function getPath(str){
    var path = str.substring(0, 6) + '/' + str.substring(6, 12) + '/' + str.substring(12, 18) + '/' + str.substring(18, 24);
    return path;
}

function filterResources(data,query_user,admin){
    var i;
    var response = [];
            
    for (i = 0; i < data.length; i++) {
        if(data[i].visibilidade == "Público" || data[i].autor == query_user || admin == true)
            response.push(data[i]);
    } 

    return response;
}


router.get('/', function(req, res) {

    let username = getUsername(req)

    if(req.query.tipo){
        Recurso.listByTipo(req.query.tipo)
            .then(r => {
                Utilizador.lookup(username)
                    .then(u => {
                        Tipo.listTop(req.query.n)
                            .then(t => { 
                                let data = {}
                                data.recurso = filterResources(r,username,u.admin)
                                data.user = u
                                data.tipo = t
                                res.status(200).jsonp(data)
                            })
                            .catch(error => res.status(500).jsonp(error))
                    })
                    .catch(erro => res.status(500).jsonp(erro))
            })
            .catch(error => res.status(500).jsonp(error))
    } else if(req.query.username) {
        Recurso.listByUser(req.query.username)
            .then(r => {
                Utilizador.lookup(req.query.username)
                    .then(u => {
                        Tipo.listTop(req.query.n)
                            .then(t => { 
                                let data = {}
                                data.recurso = filterResources(r,username,u.admin)
                                data.user = u
                                data.tipo = t
                                res.status(200).jsonp(data)
                            })
                            .catch(error => res.status(500).jsonp(error)) 
                    })
                    .catch(erro => res.status(500).jsonp(erro))
            })
            .catch(error => res.status(500).jsonp(error))
    } else if(req.query.tag) {
        Recurso.listByTag(req.query.tag)
            .then(r => {
                Utilizador.lookup(username)
                    .then(u => {
                        Tipo.listTop(req.query.n)
                            .then(t => { 
                                let data = {}
                                data.recurso = filterResources(r,username,u.admin)
                                data.user = u
                                data.tipo = t
                                res.status(200).jsonp(data)
                            })
                            .catch(error => res.status(500).jsonp(error))
                    })
                    .catch(erro => res.status(500).jsonp(erro))
                })
            .catch(error => res.status(500).jsonp(error))
    } else {  
        Recurso.list()
            .then(r => {
                Utilizador.lookup(username)
                    .then(u => {
                        Tipo.listTop(req.query.n)
                            .then(t => { 
                                let data = {}
                                data.recurso = filterResources(r,username,u.admin)
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


router.get('/novo', function(req, res) {

    let query_user = getUsername(req)
 
    Utilizador.lookup(query_user)
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

/*
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
*/

router.get('/estatisticas', function(req, res){
     var query_user = getUsername(req)
    Utilizador.lookup(query_user)
        .then(u => {
            if(u.admin == true){
                var data = {}
                Utilizador.total().then(regist => {
                    data.registados = regist;
                     Recurso.total().then(recursos => {
                        data.registados = regist;
                        data.recursos = recursos;
                            var dias = [];
                            var valores = [];
                            var ativos = [];
                            var aux = [];
                            
                            for (var i=0; i<7; i++) {
                                var d = new Date();
                                var d2 = new Date();
                                d.setDate(d.getDate() - i + 1);
                                d2.setDate(d2.getDate() - i);
                                var dia = d.toISOString().slice(0,10)
                                var dia2 = d2.toISOString().slice(0,10)
                                aux.push(dia2)
                                aux.push(dia)
                                dias.push("'"+dia2.substring(6)+"'")
                                
                            } 

                            var p1 = new Promise((resolve, reject) => {
                                var valores = []
                                Recurso.inseridosDia(aux[0],aux[1]).then(x1 => {
                                    valores.push(x1)
                                    Recurso.inseridosDia(aux[2],aux[3]).then(x2 => {
                                        valores.push(x2)
                                        Recurso.inseridosDia(aux[4],aux[5]).then(x3 => {
                                            valores.push(x3)
                                            Recurso.inseridosDia(aux[6],aux[7]).then(x4 => {
                                                valores.push(x4)
                                                Recurso.inseridosDia(aux[8],aux[9]).then(x5 => {
                                                    valores.push(x5)
                                                    Recurso.inseridosDia(aux[10],aux[11]).then(x6 => {
                                                        valores.push(x6)
                                                        Recurso.inseridosDia(aux[12],aux[13]).then(x7 => {
                                                            valores.push(x7)
                                                            resolve(valores)
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            });

                            var p2 = new Promise((resolve, reject) => {
                                var valores = []
                                Utilizador.usersAtivos(aux[0],aux[1]).then(x1 => {
                                    valores.push(x1)
                                    Utilizador.usersAtivos(aux[2],aux[3]).then(x2 => {
                                        valores.push(x2)
                                        Utilizador.usersAtivos(aux[4],aux[5]).then(x3 => {
                                            valores.push(x3)
                                            Utilizador.usersAtivos(aux[6],aux[7]).then(x4 => {
                                                valores.push(x4)
                                                Utilizador.usersAtivos(aux[8],aux[9]).then(x5 => {
                                                    valores.push(x5)
                                                    Utilizador.usersAtivos(aux[10],aux[11]).then(x6 => {
                                                        valores.push(x6)
                                                        Utilizador.usersAtivos(aux[12],aux[13]).then(x7 => {
                                                            valores.push(x7)
                                                            resolve(valores)
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            });


                            p1.then(resultado => {
                                Utilizador.alunos().then(a => {
                                    Utilizador.docentes().then(d => {
                                        p2.then(ativos => {
                                            data.ultimos7dias = dias.reverse()
                                            data.recursosinseridos = resultado.reverse()
                                            data.alunos = a
                                            data.docentes = d
                                            data.ativos = ativos.reverse()
                                            res.status(200).jsonp(data);
                                        })
                                    })
                                })
                                
                            })
                            
                    })
                })
            } else
                res.status(401).send()
        })
        .catch(error => res.status(500).jsonp(error))

})


router.get('/exportar', function(req, res) {
    var query_user = getUsername(req)
    Utilizador.lookup(query_user)
        .then(u => {
            if(u.admin == true){
                var exportzip = new JSZip();
                Recurso.list()
                    .then(recursos => {
                        var index = 0;
                        recursos.forEach(item => {
                            Recurso.lookup(item._id)
                                .then(meta => {
                                    var path = __dirname + '/../recursos/' + getPath(item._id.toString());
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
                                                exportzip.file(item._id.toString()+".zip",content)
                                                index++;
                                                if(index==recursos.length){
                                                    exportzip.generateAsync({type:"nodebuffer"})
                                                    .then(function(e) {
                                                        console.log('Export finished!')
                                                        res.setHeader('Content-Type', 'application/octet-stream');
                                                        res.status(200).send(e)
                                                    });
                                                }
                                            });
                                    });
                            })
                        })
                    })
                    .catch(error => res.status(500).jsonp(error))
            } else
                res.status(401).send()
        })
        .catch(error => res.status(500).jsonp(error))
})

// GET /recursos/:id
router.get('/:id', function(req, res) {

    let query_user = getUsername(req)

    Recurso.lookup(req.params.id)
        .then(data => {
            Utilizador.lookup(query_user)
                .then(u => {
                    if(data.autor == query_user || data.visibilidade == "Público" || u.admin == true)
                        res.status(200).jsonp(data)
                    else 
                        res.status(401).jsonp()
                })
                .catch(error => res.status(500).jsonp(error))
        })
        .catch(error => res.status(500).jsonp(error))
})



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
                        fs.writeFile(fpath, p, function (err) {
                            fs.readFile(fpath, function (err,ficheiro) {
                                var file_wordArr1 = CryptoJS.lib.WordArray.create(ficheiro);
                                var sha256_hash1 = CryptoJS.SHA256(file_wordArr1);
                                
                                var file_wordArr2 = CryptoJS.lib.WordArray.create(fs.createReadStream(fpath));
                                var sha256_hash2 = CryptoJS.SHA256(file_wordArr2);

                                var hash = zip.file("manifest-sha256.txt").async("string");
                                hash.then(function(line){
                                    // Validate checksums
                                    const r = line.split(' ')[0];

                                    if(sha256_hash1.toString() != r.substring(1) & sha256_hash2.toString() != r.substring(1)){
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
                                            .catch(error => console.log(error)/*res.status(500).jsonp(error)*/)
                                    }
                                })
                            })
                        })
                    });
                });
            });
        });
    })
})


// POST /recursos/importar
router.post('/importar', upload.single('conteudo'), function(req, res) {

    let path = __dirname + '/../' + req.file.path
    let npath = __dirname + '/../' + req.file.path + '.zip'
    
    fs.rename(path, npath, function(err) {
        if (err) throw err
        fs.readFile(npath, function(err, data) {
            if (err) throw err
            JSZip.loadAsync(data).then(function (importzip) {
                var total = 0;
                var imported = 0;
                var failed = 0;

                importzip.forEach(function(relativePath, file){
                    total++
                })
                
                if(total > 0){
                    importzip.forEach(function(relativePath, file){
                        var id = relativePath.split(".")[0];
                        var temppath = __dirname + '/../uploads/' + relativePath 
                        
                        Recurso.exists(id).then(e => {
                            if(e == false){
                                JSZip.loadAsync(file._data.compressedContent).then(function (zip) {
                                    var metadados = zip.file("metadata.json").async("string");
                                    metadados.then(function(result) {
                                        // Deconstruct metadata and add creation time
                                        var meta = JSON.parse(result); 
                                        var payload = zip.file("data/"+meta.nome).async("nodebuffer")
        
                                        payload.then(function(p) {
                                            let fpath = __dirname + '/../' + 'recursos/' + id + "/" + meta.nome
        
                                            // Create path if not exists
                                            if (!fs.existsSync(__dirname + '/../' + 'recursos/' + id)){
                                                fs.mkdirSync(
                                                    __dirname + '/../' + 'recursos/' + id, 
                                                    { recursive: true }
                                                );
                                            }
                                            fs.writeFileSync(fpath, p,'binary')
        
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
        
                                                    fs.rmdir(__dirname + '/../' + 'recursos/' + id, { recursive: true }, (err) => {
                                                        if (err) throw err;
                                                    });
                                                            
                                                    // Move file to storage tree
                                                    fs.rename(fpath, newPath, function(err) {
                                                        if (err) console.log(err)
                                                    })
                                                            
                                                    Tipo.increment(meta.tipo)
                                                        .then(x => {
                                                            imported++;
                                                            if((imported+failed)==total)
                                                                res.status(201).jsonp(imported)
                                                        })
                                                        .catch(error => console.log(error))
                                                })
                                        })
                                    })
                                });
                            } else {
                                failed++;
                                if(failed == total)
                                    res.status(200).jsonp(-1)
                                else if((imported+failed)==total)
                                    res.status(500).jsonp(imported)
                            }
                        });
                    })
                } else {
                    res.status(200).jsonp(0)
                }
            });
        });
    })
})


// PUT /recursos/:id
router.put('/:id', function(req, res) {

    let query_user = getUsername(req)

    Recurso.lookup(req.params.id)
        .then(data => {
            Utilizador.lookup(query_user)
                .then(u => {
                    if(data.autor == query_user|| u.admin == true){
                        Recurso.edit(req.params.id, req.body)
                            .then(data => res.status(200).jsonp(data))
                            .catch(error => res.status(500).jsonp(error))
                    } else
                        res.status(401).jsonp()
                })
                .catch(error => res.status(500).jsonp(error))
        })
        .catch(error => res.status(500).jsonp(error))
})

// DELETE /recursos/:id
router.delete('/:id', function(req, res) {

    let query_user = getUsername(req)

    Recurso.lookup(req.params.id)
        .then(data => {
            Utilizador.lookup(query_user)
                .then(u => {
                    if(data.autor == query_user || u.admin == true){
                        Recurso.remove(req.params.id)
                            .then(r => {
                                let path = __dirname + '/../' + 'recursos/' + getPath(data._id.toString()) + "/" + data.nome
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
        .catch(error => res.status(500).jsonp(error))
    
})

router.put('/star/:id', function(req, res) {

    let query_user = getUsername(req)

    Utilizador.lookup(query_user)
        .then(data => {
            if(data.starred.includes(req.params.id)){
                Utilizador.unstar(query_user,req.params.id)
                    .then(r => {
                        Recurso.unstar(req.params.id)
                            .then(res.status(200).send())
                            .catch(error => console.log(error))
                    })
                    .catch(error => res.status(500).jsonp(error))
            } else {
                Utilizador.star(query_user,req.params.id)
                    .then(r => {
                        Recurso.star(req.params.id)
                            .then(res.status(200).send())
                            .catch(error => console.log(error))
                    })
                    .catch(error => res.status(500).jsonp(error))
            }
        })
        .catch(error => res.status(500).jsonp(error))
});

function getUsername(request){
    
    authHeader = request.headers['authorization']
    var myToken = authHeader && authHeader.split(' ')[1]

    let username = jwt.decode(myToken).username

    return username;
}

module.exports = router
