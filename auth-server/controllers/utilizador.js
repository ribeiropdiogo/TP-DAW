// User Controller
const Utilizador = require('../models/utilizador')


// Returns a user's login credentials
module.exports.lookupCredentials = function(id) {
    return Utilizador
        .findOne({username: id}, {_id: 0, username: 1, admin: 1, salt: 1, hashedPassword: 1})
        .exec()
}


// Inserts a new user
module.exports.insert = function(u) {
    var novoUtilizador = new Utilizador(u)
    return novoUtilizador.save()
}
