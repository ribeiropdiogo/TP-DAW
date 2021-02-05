// Post Model
const mongoose = require('mongoose')

var postSchema = new mongoose.Schema({
    utilizador: String,
    texto: String,
    recurso: mongoose.ObjectId,
    data: Date,
    comentarios: [
        {
            utilizador: String,
            data: Date,
            texto: String
        }
    ]
})

module.exports = mongoose.model('post', postSchema)
