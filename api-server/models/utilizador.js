// User Model
var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: String,
    nome: String,
    email: String,
    filiacao: String,
    curso: String,
    departamento: String,
    instituicao: String,
    admin: Boolean,
    dataRegisto: Date,
    ultimoAcesso: Date
})

module.exports = mongoose.model('utilizador',userSchema)