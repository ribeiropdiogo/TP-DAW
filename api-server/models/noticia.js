// News Model
const mongoose = require('mongoose')

var noticiaSchema = new mongoose.Schema({
    _id: mongoose.ObjectId,
    utilizador: String,
    texto: String,
    recurso: mongoose.ObjectId,
    data: Date
})

module.exports = mongoose.model('noticia', noticiaSchema)
