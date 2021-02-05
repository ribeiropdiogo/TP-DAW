// Post Model
const mongoose = require('mongoose')

var postSchema = new mongoose.Schema({
    _id: mongoose.ObjectId,
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
