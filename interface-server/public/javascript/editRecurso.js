window.onload = function() {
    populaCampos();
};

function populaCampos(){
    var recurso = window.location.href.split("/").pop();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var meta = JSON.parse(xhttp.responseText)

            document.getElementById("titulo").value = meta.titulo; 
            document.getElementById("subtitulo").value = meta.subtitulo; 
            document.getElementById("tipo").value = meta.tipo;
            if(meta.visibilidade == "Público")
                document.getElementById("publico").checked = true;
            else
                document.getElementById("privado").checked = true;

            document.getElementById("tags").value = meta.tags; 
        }
    };
        
    xhttp.open("GET", "/recursos/meta/"+recurso, true); 
    xhttp.send();
}

function getRecurso() {

    var recurso = window.location.href.split("/").pop();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            JSZip.loadAsync(xhttp.response).then(function(zip){
                var metadados = zip.file("metadata.json").async("string");
                metadados.then(function(result) {
                    var meta = JSON.parse(result);
                    var payload = zip.file("data/"+meta.nome).async("blob")
                    payload.then(function(p) {
                        var extension = meta.nome.split('.').pop();
                        var isFirefox = typeof InstallTrigger !== 'undefined';
                        
                        var mimetype = meta.mimetype;
                        
                        var file = new Blob([p], {type: mimetype});
                        var fileURL = URL.createObjectURL(file);

                        if(extension=="pdf"){
                            // Viewers variam de browser para browser (Firefox é "especial")
                            if(isFirefox){
                                //$("#viewer").append('<button id="viewPDF" class="mtr-btn" type="button" style="margin-bottom: 15px;" onclick="window.open(\'' + fileURL + '\')"><span>Ver PDF</span></button>');
                            } else
                                $("#viewer").append('<iframe type="application/pdf" width="100%" height="660px" src="' + fileURL + '"></iframe>');
                        } else {
                            $("#viewer").append("<iframe src='" + fileURL + "' width='100%' height='660px'></iframe>");
                        }
                        
                        $("#descarregar").append("<a href='" + fileURL + "' download='" + meta.nome + "'>Descarregar Recurso</a>")

                        var user_link = document.getElementById("user_link").href;
                        var username = user_link.split("/").pop();

                        if(meta.autor == username ){
                            $("#editar").append("<a href='/recursos/editar/" + meta._id + "'>Editar Recurso</a>")
                            $("#apagar").append("<a href='javascript:deleteRecurso(\""+meta._id+"\");'>Apagar Recurso</a>")
                        }
                    })
                })
            })
        }
    };
    xhttp.open("GET", "/recursos/zip/"+recurso, true);
    xhttp.responseType = "arraybuffer";
    xhttp.send();
}

function updateRecurso(){

    var recurso = window.location.href.split("/").pop();

    // Process Tags
    var unprocessedTags = $("input[name=tags]").val();
    var lowerTags = unprocessedTags.toLowerCase();
    var finalTags = lowerTags.split(",");
    var tipo =  $("input[name=tipo]").val();
    var titulo = $("input[name=titulo]").val();
    var subtitulo = $("input[name=subtitulo]").val();
    var visibilidade = $("input[name=visibilidade]:checked").val()
    var autor = $("input[name=username]").val();
    var tags = finalTags;

    if(!titulo){
        alert("Introduza um Título")
    } else {
        var data = {};
        data.tipo =  tipo;
        data.titulo = titulo;
        data.subtitulo = subtitulo;
        data.visibilidade = visibilidade;
        data.tags = finalTags;

        var json = JSON.stringify(data);

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (this.status == 200) {
                window.location.replace("/recursos/"+recurso);
            }
        }

        xhr.open("PUT", '/recursos/'+recurso, true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.send(json);
        
    }
}