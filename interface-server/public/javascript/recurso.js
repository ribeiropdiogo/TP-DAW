window.onload = function() {
    getRecurso();
};

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
                        alert(meta.mimetype)
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

                    })
                })
            })
        }
    };
    xhttp.open("GET", "/recursos/zip/"+recurso, true);
    xhttp.responseType = "arraybuffer";
    xhttp.send();
}