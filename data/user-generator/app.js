var random_name = require('node-random-name');
var UsernameGenerator = require('username-generator');
var axios = require('axios');

var total = 0;

function createUser(i){
        var cursos = ["Engenharia Informática", "Engenharia Mecânica", "Medicina", "Direito", "Psicologia"]
        var departamentos = ["Departamento de Informática","Departamento de Física", "Departamento de Matemática", "Departamento de Direito", "Departamento de Química"]
        var opcao = Math.floor(Math.random() * 2);
        var posicao = Math.floor(Math.random() * 4);
        var username = UsernameGenerator.generateUsername();

        var data = {}
        data.nome = random_name({ seed: 'daw2020'+i });
        data.password  = "daw2020";
        data.email  = username + "@email.com";
        data.username  = username;
        
        if(opcao == 0){
            data.filiacao = "aluno"
            data.curso  = cursos[posicao];
        } else if(opcao == 1){
            data.filiacao = "docente"
            data.departamento  = departamentos[posicao];
        }

        data.instituicao = "Universidade do Minho";
        data.starred = [];

        var json = JSON.stringify(data, null, 4);
        
        axios.post('http://localhost:6000/utilizadores/', data)
            .then(resp => {
                total++;
                //console.log(resp)
            })
            .catch(erro => {
                //console.log(erro)
            })
}

for(var i = 0; i < 1000; i++){
    setTimeout(createUser, 500, i);
}
