var random_name = require('node-random-name');
var UsernameGenerator = require('username-generator');
var axios = require('axios');
var fs = require('fs')
const randomFile = require('select-random-file')
var mime = require('mime-types')
var JSZip = require("jszip");
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken')

var total = 0;



function createResource(i){
        var tipos = ["Slides", "Teste", "Código"]
        var opcao = Math.floor(Math.random() * 2);
        var posicao = Math.floor(Math.random() * 3);
        var username = UsernameGenerator.generateUsername();


        const dir = './pool/'+tipos[posicao]
        //console.log(dir)
        randomFile(dir, (err, file) => {
            const FormData = require('form-data')
            var data = {}
            data.tipo =  tipos[posicao];
            data.titulo = username;
            data.subtitulo = "Recurso gerado automaticamente";
            data.dataCriacao = new Date().toISOString().slice(0,19);
            data.visibilidade = "Público";
            data.autor = "ribeiro";
            data.tags = ["gerado",tipos[posicao]];
            data.nome = file;
            data.mimetype = mime.lookup(dir + '/' + file);
            data.stars = Math.floor(Math.random() * 300);

            var json = JSON.stringify(data, null, 4);
            console.log(json)

            fs.readFile(dir + '/' + file, function (err,ficheiro) {
                if (err) {
                  return console.log(err);
                }
                var zip = new JSZip();
                // bagit
                zip.file(
                    "bagit.txt", 
                    "(BagIt-version: 1.0 )\n(Tag-File-Character-Encoding: UTF-8)\n");
                // metadata
                zip.file(
                    "metadata.json", 
                    json);
                // payload
                var data = zip.folder("data");
                data.file(file, ficheiro, {base64: true});
                // manifest
                var file_wordArr = CryptoJS.lib.WordArray.create(ficheiro);
                var sha256_hash = CryptoJS.SHA256(file_wordArr);
                zip.file(
                    "manifest-sha256.txt", 
                    "(" + sha256_hash.toString() + " data/" + file + ")\n");


                zip.generateAsync({type:"nodebuffer"})
                    .then(function(content) {
                        
                        fs.writeFile('./sips/'+i+'.zip', content, function (err) {
                            
                            var form = new FormData();
                            form.append('conteudo', fs.createReadStream('./sips/'+i+'.zip'));
    
                            const headers = {headers: {
                                'Content-Type': form.getHeaders()['content-type'],
                                'Authorization':  `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJpYmVpcm8iLCJhZG1pbiI6InRydWUiLCJpYXQiOjE2MTI0Mzc5OTgsImV4cCI6MTYxNDU5Nzk5OH0.KpHxKuXp0jMk81XKn_ouHkN5ZGjD-y8Z7atnWBAABds`
                            }, maxContentLength: Infinity, maxBodyLength: Infinity }
                            //console.log(headers)
                            
                            axios.post('http://localhost:7000/recursos', form, headers)
                            .then(resp => {
                                total++;
                                //console.log(resp)
                            })
                            .catch(erro => {
                                //console.log(erro)
                            })
                        });
                });
            });
        })
}

for(var i = 0; i < 1; i++){
    createResource(i)
}
