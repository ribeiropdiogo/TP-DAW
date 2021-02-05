const Noticia = require('../models/noticia')

module.exports.list = function() {
    return Noticia
        .find()
        .exec()
}

module.exports.lookup = function(id) {
    return Noticia
        .findById(id)
        .exec()
}

module.exports.insert = function(p) {
    var novaNoticia = new Noticia(p)
    return novaNoticia.save()
}

module.exports.remove = function(id) {
    return Noticia
        .deleteOne({_id: id})
        .exec()
}

module.exports.edit = function(id, p) {
    return Noticia
        .findByIdAndUpdate(id, p, {new: true})
        .exec()
}
