// User Controller
const Utilizador = require('../models/utilizador')


// Returns User list
module.exports.list = function() {
    return Utilizador.find(
        {},
        {hashedPassword: 0, salt: 0, __v: 0}
    ).exec()
}


// Returns a user record
/*module.exports.lookup = function(id) {
    return Utilizador.findOne(
        {username: id},
        {hashedPassword: 0, salt: 0, __v: 0}
    ).exec()
}
*/

module.exports.lookup = function(id) {
    return Utilizador.findById(
        id,
        {hashedPassword: 0, salt: 0, __v: 0}
    ).exec()
}

// Returns a user with the login credentials
module.exports.credentials = function(id) {
    return Utilizador.findOne({username: id}, {__v: 0}).exec()
}


// Inserts a new user
module.exports.insert = function(u) {
    var novoUtilizador = new Utilizador(u)
    return novoUtilizador.save()
}


// Edit one user
module.exports.edit = function(id, u) {
    return Utilizador.findByIdAndUpdate(id, u, {new: true}).exec()
}


// Removes one user
module.exports.remove = function(id) {
    return Utilizador.deleteOne({username: id}).exec()
}
