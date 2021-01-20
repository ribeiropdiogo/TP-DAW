// Type Model
const mongoose = require('mongoose')

var typeSchema = new mongoose.Schema({
    _id: String,
    recursos: Number
})

module.exports = mongoose.model('tipo', typeSchema)
