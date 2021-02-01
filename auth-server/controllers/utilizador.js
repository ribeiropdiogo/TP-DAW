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

// Verificar se o user associado a um email existe
module.exports.lookupUser = function(id) {
    return Utilizador
        .findOne({email: id}, {_id: 0, username: 1, salt: 1})
        .exec()
}

//Inserir reset token e tokenExpTime na DB
// Edit one user
module.exports.updateResetToken = function(id, tkn, tknExp) {
    return Utilizador
        // Mongoose sends an `updateOne({ _id: doc._id }, { $set: { name: 'foo' } })`
        .findOneAndUpdate({email: id}, { $set: { resetToken: tkn, resetTokenExp: tknExp } }, {new: true})
        .select({hashedPassword: 0, salt: 0, __v: 0})
        .exec()
}