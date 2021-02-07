const express = require('express')
const router = express.Router()

const Post = require('../controllers/post')
const Noticia = require('../controllers/noticia')


function filter(data, query_user, admin) {
    if (admin == true)
        return data
    
    var i
    var response = []
    
    for (i = 0; i < data.length; i++) {
        if(data[i].rec.visibilidade == "Público" || data[i].autor == query_user)
            response.push(data[i])
    } 

    return response
}

function compare( a, b ) {
    if ( a.data < b.data )
        return 1;
    if ( a.data > b.data )
        return -1;
    return 0;
}

router.get('/', function(req, res) {
    Post.list()
        .then(dadosp => {
            var posts = filter(dadosp, req.token.username, req.token.admin)
            Noticia.list()
                .then(dadosn => {
                    var noticias = filter(dadosn, req.token.username, req.token.admin)
                    var r = posts.concat(noticias)
                    r.sort(compare)
                    res.status(200).jsonp(r)
                })
                .catch(e => res.status(500).jsonp({error: e}))
        })
        .catch(e => res.status(500).jsonp({error: e}))
})


module.exports = router
