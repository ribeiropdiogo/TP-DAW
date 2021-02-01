// User Controller
const Utilizador = require('../models/utilizador')


// Returns a user's login credentials
module.exports.lookupCredentials = function(id) {
    return Utilizador
        .findOne({username: id}, {_id: 0, username: 1, admin: 1, salt: 1, hashedPassword: 1, email: 1})
        .exec()
}


// Inserts a new user
module.exports.insert = function(u) {
    var novoUtilizador = new Utilizador(u)
    return novoUtilizador.save()
}

// Verificar se o user associado a um email existe
module.exports.lookupUserByEmail = function(id) {
    return Utilizador
        //.findOne({email: id}, {_id: 0, salt: 1, resetToken: 1, resetTokenExp: 1})
        .findOne({email: id}, {_id: 0, username: 1, hashedPassword: 1})
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