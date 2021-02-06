var curso = $(`
    <div class="form-group">
        <input type="text" id="curso" name="curso" required="required"/>
        <label class="control-label" for="curso">Curso</label><i class="mtrl-select"></i>
    </div>
`)


var departamento = $(`
    <div class="form-group">
        <input type="text" id="departamento" name="departamento" required="required"/>
        <label class="control-label" for="curso">Departamento</label><i class="mtrl-select"></i>
    </div>
`)

$(document).ready(function(){
    $("#sec_filiacao").append(curso);
});

$(function() {
    $("input:radio[name=filiacao]").on("change", function() {
        if ($(this).is(":checked")) {
            if ($(this).val() == "aluno"){
                $("#sec_filiacao").empty()
                $("#sec_filiacao").append(curso)
            } else if ($(this).val() == "docente"){
                $("#sec_filiacao").empty()
                $("#sec_filiacao").append(departamento)
            }
        }
      })
  })



//On Click -> Login
function login(){
    var data = {};

    data.username  = $("input[name=username]").val();
    data.password = $("input[name=password]").val();

    var json = JSON.stringify(data);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            window.location.replace("/feed");
        } else if(xhr.status == 401){
            alert("Check if your credentials are correct!");
        } else if(xhr.status == 500){
            alert("The server exploded, please try again later...");
        }
    } 

    xhr.open("POST", '/utilizadores/login', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(json);
}

//On Click -> Register
function register(){
    var data = {};
    data.nome = $("input[name=name]").val();
    data.password  = $("input[name=rpassword]").val();
    data.email  = $("input[name=email]").val();
    
    if($("input[name=curso]").val())
        data.filiacao = "aluno"
    else if($("input[name=departamento]").val())
        data.filiacao = "docente"

    data.username  = $("input[name=rusername]").val();
    data.curso  = $("input[name=curso]").val();
    data.departamento  = $("input[name=departamento]").val();
    data.instituicao = $("input[name=instituicao]").val();
    data.starred = [];

    var json = JSON.stringify(data);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            window.location.replace("/login");
        } else if(xhr.status == 409){
            alert("Username or Email already exist");
        }
    }

    xhr.open("POST", '/utilizadores', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(json);
}

// Recuperar PWD
//On Click -> Send Reset Token
function sendResetPassword(){
    var data = {};

    data.email  = $("input[name=email]").val();

    var json = JSON.stringify(data);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {

        if(xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status == 500){
                window.location.replace("/login");
                alert("Ocorreu um erro... Volte a tentar.");
            }else{
                window.location.replace("/login");
                alert("O Email Enviado. Por favor verifique o endereço correspondente.");
            }
        }   
    } 

    xhr.open("POST", '/utilizadores/recuperaPassword', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(json);
}


//On Click -> Update Password
function updatePassword(){

    var data = {};

    data.newPassword  = $("input[name=npassword]").val();
    var pwd_confirm = $("input[name=password_conf]").val()

    var reset_token = String(window.location).match(/\/([^\/]+)\/?$/)[1]

    if(data.newPassword === pwd_confirm){

        data.token = reset_token

        var json = JSON.stringify(data);
    
        var xhr = new XMLHttpRequest();
    
        xhr.onreadystatechange = function() {

            if(xhr.readyState === XMLHttpRequest.DONE) {

                if(xhr.status == 200) {
                    window.location.replace("/feed");
                }else if(xhr.status == 401){
                    window.location.replace("/login");
                    alert("Ocorreu um problema no processo de reposição... Tente de Novo.");
                }else if(xhr.status == 422){
                    alert("A Password deve ter mais de 5 caracteres.");
                }else{
                    window.location.replace("/login");
                    alert("Ocorreu um problema, volte a tentar...");
                }
            }
        } 
    
        xhr.open("POST", '/utilizadores/redefinePassword', true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.send(json);

    }else{

        alert('As Passwords Introduzidas não correspondem!... Tente de novo.')
    }
}
function getRecursosByTag(){
    var tag = $("input[name=tag]").val()
    window.location.replace("/recursos?tag="+tag);
}

function exportarRecursos(){
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var a = document.getElementById("exportar");
            var file = new Blob([xhttp.response], {type: "application/zip"});
            //alert("file received " + URL.createObjectURL(file))
            document.location.href = URL.createObjectURL(file);
        }
    };

    xhttp.open("GET", "/recursos/exportar", true);
    xhttp.responseType = "arraybuffer";
    xhttp.send();
}

function importarRecursos(){
    var input = document.createElement('input');
    input.type = 'file';
    input.accept="application/zip"
    input.click();

    input.onchange = function(event) {
        var file = event.target.files[0];

        var formData = new FormData();
        formData.append('conteudo', file);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if(xhr.status == 201) {
                    if(xhr.response == -1)
                        alert("Todos os registos já existem!")
                    else
                        alert("Registos importados com sucesso: " + xhr.response)
                }else if(xhr.status == 401){
                    window.location.replace("/login");
                    alert("A Sua Sessão Expirou... Volte a Fazer Login!");
                }else if(xhr.status == 500){
                    alert("Ocorreu um erro!");
                }
            }
        }
                
        xhr.open("POST", '/recursos/importar', true);
        xhr.send(formData);
    }
}

function logout(){
    window.location.replace("/utilizadores/logout");
}
