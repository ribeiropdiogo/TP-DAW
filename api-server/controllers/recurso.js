// Type Controller
const Recurso = require('../models/recurso')

module.exports.total = function() {
    return Recurso.countDocuments().exec();
}

module.exports.inseridosDia = function(datai, dataf) {
    return Recurso.countDocuments({dataRegisto: {$gt: new Date(datai), $lt: new Date(dataf)}}).exec();
}

// Returns Resource list
module.exports.list = function() {
    return Recurso
        .find()
        .exec()
}

module.exports.exists = function(id) {
    return Recurso.exists({_id: id})
}

module.exports.listByTipo = function(t) {
    return Recurso
        .find({tipo: t})
        .exec()
}

module.exports.listByTag = function(tag) {
    return Recurso
        .find({tags: tag})
        .exec()
}

module.exports.listByUser = function(a) {
    return Recurso
        .find({autor: a})
        .exec()
}

// Returns a resource record
module.exports.lookup = function(id) {
    return Recurso
        .findById(id)
        .exec()
}

// Inserts a new resource
module.exports.insert = function(r) {
    var novoRecurso = new Recurso(r)
    return novoRecurso.save()
}

// Removes one resource
module.exports.remove = function(id) {
    return Recurso
        .deleteOne({_id: id})
        .exec()
}

// Edit one resource
module.exports.edit = function(id, r) {
    return Recurso
        .findByIdAndUpdate(id, r, {new: true})
        .exec()
}

// Star one resource
module.exports.star = function(id) {
    return Recurso
        .findByIdAndUpdate(id, {$inc: {stars: 1}}, {new: true})
        .exec()
}

// Unstar one resource
module.exports.unstar = function(id) {
    return Recurso
        .findByIdAndUpdate(id, {$inc: {stars: -1}}, {new: true})
        .exec()
}

