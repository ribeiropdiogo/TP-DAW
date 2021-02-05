// News Model
const mongoose = require('mongoose')

var noticiaSchema = new mongoose.Schema({
    utilizador: String,
    texto: String,
    recurso: mongoose.ObjectId,
    data: Date
})

module.exports = mongoose.model('noticia', noticiaSchema)
