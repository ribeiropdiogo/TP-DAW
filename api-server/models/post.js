// Post Model
var mongoose = require('mongoose')

var postSchema = new mongoose.Schema({
    utilizador: String,
    texto: String,
    recurso: String,
    comentarios: [String]
})

module.exports = mongoose.model('post',postSchema)