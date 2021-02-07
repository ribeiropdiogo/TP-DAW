function sendNoticia(username) {
    var text = document.getElementById('textarea-noticia').value
    var body = { utilizador: username, texto: text }
    
    if (text) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 201) {
                    document.getElementById('textarea-noticia').value = ""
                    var res = JSON.parse(this.responseText)
                    $('#noticia-div').prepend(`
                    <div class="central-meta item" style="display: inline-block;" id="noticia${res._id}">
                        <div class="user-post">
                            <div class="friend-info">
                                <table style="width: 100%;">
                                    <tr>
                                        <td>
                                            <span style="color: #999; float: left; font-size: 12px; width: 100%;">
                                                Published: ${res.data}
                                            </span>
                                        </td>
                                        <td>
                                            <button type="button" onclick="deleteNoticia('${res._id}')" style="float: right; font-size: 10px; border: 1px solid #5d6371; border-radius: 5px; padding: 5px; background-color: transparent;">
                                                Apagar
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                                <div class="post-meta">
                                    <div class="description">
                                        <p>${res.texto}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`)
                } else {
                    alert('Ocorreu um erro')
                }
            }
        }

        xhttp.open("POST", "/noticias", true);
        xhttp.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhttp.send(JSON.stringify(body));
    } else {
        alert('Inválido')
    }
}

function deleteNoticia(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                $('#noticia'+id).remove()
            } else {
                alert('Ocorreu um erro')
            }
        }
    };

    xhttp.open("DELETE", "/noticias/"+id, true);
    xhttp.send();
}
