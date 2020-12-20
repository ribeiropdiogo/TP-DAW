// Type Controller
const Recurso = require('../models/recurso')

// Returns Resource list
module.exports.list = function() {
    return Recurso.find().exec()
}

// Returns a resource record
module.exports.lookup = function(id) {
    return Recurso.findOne({_id: id}).exec()
}

// Inserts a new resource
module.exports.insert = function(r) {
    var novoRecurso = new Recurso(r)
    return novoRecurso.save()
}

// Removes one resource
module.exports.remove = function(id) {
    return Recurso.deleteOne({_id: id}).exec()
}

// Edit one resource
module.exports.edit = function(id, r) {
    return Recurso.findByIdAndUpdate(id, r, {new: true}).exec()
}
