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