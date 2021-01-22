// Resource Model
const mongoose = require('mongoose')

var resourceSchema = new mongoose.Schema({
    tipo: String,
    titulo: String,
    subtitulo: String,
    dataCriacao: Date,
    dataRegisto: Date,
    visibilidade: String,
    nome: String,
    autor: String,
    tags: [String]
})

module.exports = mongoose.model('recurso', resourceSchema)
