// User Controller
var mongoose = require('mongoose')
const { model } = require('../models/utilizador')
var Utilizador = require('../models/utilizador')

// Returns User list
module.exports.list = function(){
    return Utilizador.find().exec()
}

// Returns a user record
module.exports.lookUp = function(u){
    return Utilizador.findOne({username: u}).exec()
}

// Inserts a new user
module.exports.insert = function(u){
    console.log(JSON.stringify(u))
    var novoUtilizador = new Utilizador(u)
    return novoUtilizador.save()
}

// Removes one user
module.exports.remove = function(u){
    return Utilizador.deleteOne({username: u}).exec()
}

// Edit one user
module.exports.edit = function(id, u){
    return Utilizador.findByIdAndUpdate(id, u, {new: true})
}