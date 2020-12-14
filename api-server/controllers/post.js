// Post Controller
var mongoose = require('mongoose')
const { model } = require('../models/post')
var Post = require('../models/post')

// Returns Post list
module.exports.list = function(){
    return Post.find().exec()
}

// Returns a Post record
module.exports.lookUp = function(r){
    return Post.findOne({_id: r}).exec()
}

// Inserts a new Post
module.exports.insert = function(p){
    console.log(JSON.stringify(p))
    var novoPost = new Post(p)
    return novoPost.save()
}

// Removes one Post
module.exports.remove = function(p){
    return Post.deleteOne({_id: p}).exec()
}

// Edit one Post
module.exports.edit = function(id, p){
    return Post.findByIdAndUpdate(id, p, {new: true})
}