function postTipo() {
    var data = {};
    data._id = $("input[name=nome]").val();
    data.recursos  = 0;

    var json = JSON.stringify(data);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 201) {
            window.location.replace("/recursos/novo");
        } else if(xhr.status == 500){
            alert("Ocorreu um erro!");
        }
    }

    xhr.open("POST", '/tipos', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(json);
}

function deleteRecurso(id) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.status == 200) {
            window.location.replace("/");
        } else if(xhr.status == 500){
            alert("Ocorreu um erro!");
        }
    }

    xhr.open("DELETE", '/recursos/'+id, true);
    xhr.send(null);
}

function postRecurso() {

    
    var e = document.getElementById("tipo");
    // Process Tags
    var unprocessedTags = $("input[name=tags]").val();
    var lowerTags = unprocessedTags.toLowerCase();
    var finalTags = lowerTags.split(", ");
    var tipo =  e.options[e.selectedIndex].text;
    var titulo = $("input[name=titulo]").val();
    var subtitulo = $("input[name=subtitulo]").val();
    var dataCriacao = new Date().toISOString().slice(0,19);
    var visibilidade = $("input[name=visibilidade]:checked").val()
    var autor = $("input[name=username]").val();
    var tags = finalTags;
    var conteudo = $("input[name=conteudo]")[0].files[0]

    if(!titulo){
        alert("Introduza um Título")
    } else {
        var data = {};
        data.tipo =  tipo;
        data.titulo = titulo;
        data.subtitulo = subtitulo;
        data.dataCriacao = dataCriacao;
        data.visibilidade = visibilidade;
        data.autor = $("input[name=username]").val();
        data.tags = finalTags;
        data.nome = conteudo.name;
        data.mimetype = conteudo.type;

        var json = JSON.stringify(data, null, 3);

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
        data.file(conteudo.name, conteudo, {base64: true});
        // manifest
        var file_wordArr = CryptoJS.lib.WordArray.create(conteudo);
        var sha256_hash = CryptoJS.SHA256(file_wordArr);
        zip.file(
            "manifest-sha256.txt", 
            "(" + sha256_hash.toString() + " data/" + conteudo.name + ")\n");


        zip.generateAsync({type:"blob"})
            .then(function(content) {

                var formData = new FormData();
                formData.append('conteudo', content);

                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function() {
                    if(xhr.status == 201) {
                        window.location.replace("/");
                    } else if(xhr.status == 500){
                        alert("Ocorreu um erro!");
                    }
                }
                
                xhr.open("POST", '/recursos', true);
                //xhr.setRequestHeader('Content-type','multipart/form-data');
                xhr.send(formData);
        });
    }
}