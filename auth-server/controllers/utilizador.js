// User Controller
const Utilizador = require('../models/utilizador')

// Returns a user's login credentials
module.exports.lookupCredentials = function(n) {
    return Utilizador
        .findOne({username: n}, {_id: 0, username: 1, admin: 1, salt: 1, hashedPassword: 1, email: 1})
        .exec()
}

// Inserts a new user
module.exports.insert = function(u) {
    var novoUtilizador = new Utilizador(u)
    return novoUtilizador.save()
}

module.exports.updateUltimoAcesso = function(n, d) {
    return Utilizador
        .findOneAndUpdate({username: n}, { $set: { ultimoAcesso: d } })
        .exec()
}

// Verificar se o user associado a um email existe
module.exports.lookupUserByEmail = function(id) {
    return Utilizador
        //.findOne({email: id}, {_id: 0, salt: 1, resetToken: 1, resetTokenExp: 1})
        .findOne({email: id}, {_id: 0, username: 1, hashedPassword: 1, admin: 1})
        .exec()
}

//Reset Password
module.exports.updatePwd = function(id, hsh, slt) {
    return Utilizador
        // Mongoose sends an `updateOne({ _id: doc._id }, { $set: { name: 'foo' } })`
        .findOneAndUpdate({username: id}, { $set: { hashedPassword: hsh, salt: slt } }, {new: true})
        .select({hashedPassword: 0, salt: 0, __v: 0})
        .exec()
}
