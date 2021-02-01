// User Controller
const Utilizador = require('../models/utilizador')


// Returns user list
module.exports.list = function() {
    return Utilizador
        .find({}, {hashedPassword: 0, salt: 0, __v: 0})
        .exec()
}


// Returns a user record
module.exports.lookup = function(n) {
    return Utilizador
        .findOne({username: n}, {hashedPassword: 0, salt: 0, __v: 0})
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
module.exports.edit = function(n, u) {
    return Utilizador
        .findOneAndUpdate({username: n}, u, {new: true})
        .select({hashedPassword: 0, salt: 0, __v: 0})
        .exec()
}


// Removes one user
module.exports.remove = function(n) {
    return Utilizador
        .deleteOne({username: n})
        .exec()
}
