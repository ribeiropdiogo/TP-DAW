// Post Controller
const Post = require('../models/post')

// Returns Post list
module.exports.list = function() {
    return Post
        .aggregate([
            {
                $lookup: {
                    from: 'utilizadores',
                    localField: 'utilizador',
                    foreignField: 'username',
                    as: 'output1'
                }
            },
            { $set: { usr: { $arrayElemAt: [ "$output1", 0 ] } } },
            {
                $lookup: {
                    from: 'recursos',
                    localField: 'recurso',
                    foreignField: '_id',
                    as: 'output2'
                }
            },
            { $set: { rec: { $arrayElemAt: [ "$output2", 0 ] } } },
            { $sort: { data: -1 } },
            { $project: {
                utilizador: 1,
                recurso: 1,
                texto: 1,
                comentarios: 1,
                data: 1,
                'usr.nome': 1,
                'rec.tipo': 1,
                'rec.titulo': 1,
                'rec.autor': 1
            } }
        ])
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
        .updateOne({_id: id}, {$push: {comentarios: c}})
        .exec()
}

// Removes a comment
module.exports.removeComment = function(id, c) {
    return Post
        .updateOne({_id: id}, {$pull: {comentarios: {utilizador: c.utilizador, data: c.data}}})
        .exec()
}
