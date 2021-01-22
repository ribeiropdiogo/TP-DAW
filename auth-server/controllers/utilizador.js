// User Controller
const Utilizador = require('../models/utilizador')


module.exports.filter = function(u) {
    u.hashedPassword = undefined
    u.salt = undefined
    u.__v = undefined
    return u
}


// Returns a user record
module.exports.lookup = function(id) {
    return Utilizador
        .findOne({username: id}, {hashedPassword: 0, salt: 0, __v: 0})
        .exec()
}


// Returns a user with the login credentials
module.exports.lookupWithCredentials = function(id) {
    return Utilizador
        .findOne({username: id}, {__v: 0})
        .exec()
}


// Inserts a new user
module.exports.insert = function(u) {
    var novoUtilizador = new Utilizador(u)
    return novoUtilizador.save()
}
