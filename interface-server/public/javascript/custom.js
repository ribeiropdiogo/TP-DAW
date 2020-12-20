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


function register(){
    var data = {};
    data.name = $("input[name=name]").val();
    data.password  = $("input[name=rpassword]").val();
    data.email  = $("input[name=email]").val();
    
    if($("input[name=curso]").val())
        data.filiacao = "aluno"
    else if($("input[name=departamento]").val())
        data.filiacao = "docente"

    data.username  = $("input[name=email]").val();
    data.curso  = $("input[name=curso]").val();
    data.departamento  = $("input[name=departamento]").val();
    data.instituicao = $("input[name=instituicao]").val();

    var json = JSON.stringify(data);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            //alert(xhr.responseText);
            window.location.replace("/login");
        }
    }

    xhr.open("POST", '/utilizadores', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(json);
}