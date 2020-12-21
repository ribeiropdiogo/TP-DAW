// User Model
const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: {type: String, index: {unique: true, dropDups: true}},
    nome: String,
    email: {type: String, index: {unique: true, dropDups: true}},
    filiacao: String,
    curso: String,
    departamento: String,
    instituicao: String,
    admin: Boolean,
    dataRegisto: Date,
    ultimoAcesso: Date,
    hashedPassword: String,
    salt: String
})

module.exports = mongoose.model('utilizador', userSchema, 'utilizadores')
