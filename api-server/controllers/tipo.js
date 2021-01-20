// Type Controller
const Tipo = require('../models/tipo')

// Returns Type list
module.exports.list = function() {
    return Tipo.find().exec()
}

// Returns Type list top 7
module.exports.listTop = function(top) {
    return Tipo
        .find()
        .sort({'recursos': 1})
        .limit(parseInt(top))
        .exec()
}

// Returns a type record
module.exports.lookup = function(id) {
    return Tipo.findOne({_id: id}).exec()
}

// Inserts a new type
module.exports.insert = function(t) {
    var novoTipo = new Tipo(t)
    return novoTipo.save()
}

// Removes one type
module.exports.remove = function(id) {
    return Tipo.deleteOne({_id: id}).exec()
}

// Edit one type
module.exports.edit = function(id, t) {
    return Tipo.findByIdAndUpdate(id, t, {new: true}).exec()
}
