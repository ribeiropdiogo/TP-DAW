// Type Model
const mongoose = require('mongoose')

var typeSchema = new mongoose.Schema({
    nome: String
})

module.exports = mongoose.model('tipo', typeSchema)
