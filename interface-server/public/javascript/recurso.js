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

                        var admin = document.getElementById("user_link").title;

                        if(meta.autor == username || admin == "true"){
                            $("#editar").append("<a href='/recursos/editar/" + meta._id + "'>Editar Recurso</a>")
                            $("#apagar").append("<a href='javascript:deleteRecurso(\"" + meta._id + "\");'>Apagar Recurso</a>")
                        }

                        $("#criarpost").append("<a href='javascript:openPostForm(\"" + meta._id + "\");'>Criar Post</a>")
                    })
                })
            })
        }
    };
    xhttp.open("GET", "/recursos/zip/"+recurso, true);
    xhttp.responseType = "arraybuffer";
    xhttp.send();
}


function openPostForm(id) {
    $('#display').empty()
    $('#display').append(`
    <div style="
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px #000;
        text-align: left;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        z-index: 1;
        padding: 20px;
        box-sizing: border-box;
        margin: auto;
        width: 50%;
        max-height: 300px;
        height: 80%;
    ">
        <form>
            <div class="form-group">
                <textarea rows="4" id="input-texto" required="required"/>
                <label class="control-label" for="input-texto">Texto</label><i class="mtrl-select"></i>
            </div>
            <div class="submit-btns">
                <button type="button" class="mtr-btn" onclick="sendPost('${id}')"><span>Criar post</span></button>
            </div>
        </form>
    </div>
    `)
    $('#display').modal()
}


function sendPost(id) {
    var texto = document.getElementById("input-texto").value

    if (texto) {
        var username = document.getElementById("input-username").value
        var body = {
            utilizador: username,
            recurso: id,
            texto: texto
        }

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 201) {
                    alert('Post publicado!')
                    $('#display').modal('hide')
                } else {
                    alert('Ocorreu um erro')
                }
            }
        };

        xhttp.open("POST", "/posts", true);
        xhttp.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhttp.send(JSON.stringify(body));

    } else {
        alert('Inválido')
    }
}


// ADD|REMOVE STARS
function star(){

    var recurso = window.location.href.split("/").pop();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if(this.readyState === XMLHttpRequest.DONE) {
        
            if(this.status == 200){
                alert('Teste')
            }else if(this.status == 401){
                window.location.replace("/login");
                alert("A Sua Sessão Expirou... Volte a Fazer Login!");
            }
        }

        /*
        if (this.readyState == 4 && this.status == 200) {
            
        }*/
    };

    xhttp.open("PUT", "/recursos/star/" + recurso, true);
    xhttp.send();
}