// Type Controller
var mongoose = require('mongoose')
const { model } = require('../models/recurso')
var Recurso = require('../models/recurso')

// Returns Resource list
module.exports.list = function(){
    return Recurso.find().exec()
}

// Returns a resource record
module.exports.lookUp = function(r){
    return Recurso.findOne({_id: r}).exec()
}

// Inserts a new resource
module.exports.insert = function(r){
    console.log(JSON.stringify(r))
    var novoRecurso = new Recurso(r)
    return novoRecurso.save()
}

// Removes one resource
module.exports.remove = function(r){
    return Recurso.deleteOne({_id: r}).exec()
}

// Edit one resource
module.exports.edit = function(id, r){
    return Recurso.findByIdAndUpdate(id, r, {new: true})
}