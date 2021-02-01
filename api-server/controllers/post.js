// Post Controller
const Post = require('../models/post')

// Returns Post list
module.exports.list = function() {
    return Post
        .find()
        .exec()
}

// Returns a Post record
module.exports.lookup = function(id) {
    return Post
        .findById(id)
        .exec()
}

// Inserts a new Post
module.exports.insert = function(p) {
    var novoPost = new Post(p)
    return novoPost.save()
}

// Removes one Post
module.exports.remove = function(id) {
    return Post
        .deleteOne({_id: id})
        .exec()
}

// Edit one Post
module.exports.edit = function(id, p) {
    return Post
        .findByIdAndUpdate(id, p, {new: true})
        .exec()
}

// Inserts a new comment
module.exports.insertComment = function(id, c) {
    return Post
        .update({_id: id}, {$push: {comentarios: c}})
        .exec()
}
