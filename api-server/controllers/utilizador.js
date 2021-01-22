// User Controller
const Utilizador = require('../models/utilizador')


// Returns user list
module.exports.list = function() {
    return Utilizador
        .find({}, {hashedPassword: 0, salt: 0, __v: 0})
        .exec()
}


// Returns a user record
module.exports.lookup = function(id) {
    return Utilizador
        .findOne({username: id}, {hashedPassword: 0, salt: 0, __v: 0})
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
        .select({hashedPassword: 0, salt: 0, __v: 0})
        .exec()
}
