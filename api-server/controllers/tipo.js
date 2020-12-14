// Type Controller
var mongoose = require('mongoose')
const { model } = require('../models/tipo')
var Tipo = require('../models/tipo')

// Returns Type list
module.exports.list = function(){
    return Tipo.find().exec()
}

// Returns a type record
module.exports.lookUp = function(id){
    return Tipo.findOne({_id: id}).exec()
}

// Inserts a new type
module.exports.insert = function(t){
    console.log(JSON.stringify(t))
    var novoTipo = new Tipo(t)
    return novoTipo.save()
}

// Removes one type
module.exports.remove = function(t){
    return Tipo.deleteOne({_id: t}).exec()
}

// Edit one type
module.exports.edit = function(id, t){
    return Tipo.findByIdAndUpdate(id, t, {new: true})
}