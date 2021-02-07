const Noticia = require('../models/noticia')


module.exports.list = function() {
    return Noticia
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
                data: 1,
                'usr.nome': 1,
                'rec.tipo': 1,
                'rec.titulo': 1,
                'rec.autor': 1,
                'rec.visibilidade': 1
            } }
        ])
        .exec()
}

module.exports.listByUsername = function(n) {
    return Noticia
        .aggregate([
            {
                $match: {utilizador: n, recurso: undefined}
            },
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
                data: 1,
                'rec.tipo': 1,
                'rec.titulo': 1,
                'rec.autor': 1,
                'rec.visibilidade': 1
            } }
        ])
        .exec()
}

module.exports.lookup = function(id) {
    return Noticia
        .findById(id)
        .exec()
}

module.exports.insert = function(p) {
    var novaNoticia = new Noticia(p)
    return novaNoticia.save()
}

module.exports.remove = function(id) {
    return Noticia
        .deleteOne({_id: id})
        .exec()
}
