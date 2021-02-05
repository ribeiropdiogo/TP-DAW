// User Model
const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: {type: String, index: {unique: true, dropDups: true}},
    nome: String,
    email: {type: String, index: {unique: true, lowercase: true, dropDups: true}},
    filiacao: String,
    curso: String,
    departamento: String,
    instituicao: {type: String, required: true},
    admin: {type: Boolean, required: true},
    dataRegisto: Date,
    ultimoAcesso: Date,
    hashedPassword: String,
    starred: [String],
    salt: String,
})

module.exports = mongoose.model('utilizador', userSchema, 'utilizadores')
