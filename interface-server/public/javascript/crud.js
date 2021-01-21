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

function postRecurso() {

    var e = document.getElementById("tipo");
    // Process Tags
    var unprocessedTags = $("input[name=tags]").val();
    var lowerTags = unprocessedTags.toLowerCase();
    var finalTags = lowerTags.split(", ");

    var data = {};
    data.tipo =  e.options[e.selectedIndex].text;
    data.titulo = $("input[name=titulo]").val();
    data.subtitulo = $("input[name=subtitulo]").val();
    data.dataCriacao = new Date().toISOString().slice(0,19);
    data.visibilidade = $("input[name=visibilidade]:checked").val()
    data.autor = $("input[name=username]").val();
    data.tags = finalTags;

    var json = JSON.stringify(data);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 201) {
            window.location.replace("/");
        } else if(xhr.status == 500){
            alert("Ocorreu um erro!");
        }
    }

    xhr.open("POST", '/recursos', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.send(json);
}