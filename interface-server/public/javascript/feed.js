function comment(id) {
    var texto = document.getElementById("textarea" + id).value

    if (texto) {
        var body = {
            utilizador: document.getElementById("input-username").value,
            texto: texto
        }

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 201) {
                    document.getElementById("textarea" + id).value = ""
                    var res = JSON.parse(this.responseText)
                    $('#comment-ul').append(`
                        <li>
                            <div class="we-comment">
                                <div class="coment-head">
                                    <h5>${body.utilizador}</h5>
                                    <span>${res.data}</span>
                                </div>
                                <p>${body.texto}</p>
                            </div>
                        </li>
                    `)
                    alert('Comentário publicado!')
                } else {
                    alert('Ocorreu um erro')
                }
            }
        };

        xhttp.open("POST", "/posts/comentarios/"+id, true);
        xhttp.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhttp.send(JSON.stringify(body));

    } else {
        alert('Inválido')
    }
}


function deletePost(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                $('#post'+id).remove()
                alert('Post apagado!')
            } else {
                alert('Ocorreu um erro')
            }
        }
    };

    xhttp.open("DELETE", "/posts/"+id, true);
    xhttp.send();
}
