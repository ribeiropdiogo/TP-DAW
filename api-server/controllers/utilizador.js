// User Controller
const Utilizador = require('../models/utilizador')


// Returns user list
module.exports.list = function() {
    return Utilizador
        .find({}, {hashedPassword: 0, salt: 0, __v: 0})
        .exec()
}

module.exports.usersAtivos = function(datai, dataf) {
    return Utilizador.countDocuments({ultimoAcesso: {$gt: new Date(datai), $lt: new Date(dataf)}}).exec();
}

module.exports.total = function() {
    return Utilizador.countDocuments().exec();
}

module.exports.alunos = function() {
    return Utilizador.countDocuments({filiacao: "aluno"}).exec();
}

module.exports.docentes = function() {
    return Utilizador.countDocuments({filiacao: "docente"}).exec();
}

// Returns a user record
module.exports.lookup = function(id) {
    return Utilizador
        .findOne({username: id}, {hashedPassword: 0, salt: 0, __v: 0})
        .exec()
}

module.exports.star = function(id, recurso) {
    return Utilizador
        .findOneAndUpdate({username: id}, { $push: { starred: recurso } }, {new: true})
        .exec()
}

module.exports.unstar = function(id, recurso) {
    return Utilizador
        .findOneAndUpdate({username: id}, { $pull: { starred: recurso } }, {new: true})
        .exec()
}

// Edit one user
module.exports.edit = function(id, u) {
    return Utilizador
        .findOneAndUpdate({username: id}, u, {new: true})
        .select({hashedPassword: 0, salt: 0, __v: 0})
        .exec()
}


// Removes one user
module.exports.remove = function(id) {
    return Utilizador
        .deleteOne({username: id})
        .exec()
}
