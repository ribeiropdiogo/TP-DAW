// Post Model
const mongoose = require('mongoose')

var postSchema = new mongoose.Schema({
    utilizador: String,
    texto: String,
    recurso: String,
    comentarios: [
        {
            utilizador: String,
            texto: String
        }
    ]
})

module.exports = mongoose.model('post', postSchema)
