const express = require('express')
const router = express.Router()

const Noticia = require('../controllers/noticia')


router.get('/:username', function(req, res) {
    if (req.token.admin == true) {
        Noticia.listByUsername(req.params.username)
            .then(dados => res.status(200).jsonp(dados))
            .catch(e => res.status(500).jsonp({error: e}))
    } else {
        res.status(401).send()
    }
})

// POST /noticias
router.post('/', function(req, res) {
    if (req.token.admin == true) {
        req.body.data = new Date()

        Noticia.insert(req.body)
            .then(dados => res.status(201).jsonp(dados))
            .catch(e => res.status(500).jsonp({error: e}))
    } else {
        res.status(401).send()
    }
})

// DELETE /noticias/:id
router.delete('/:id', function(req, res) {
    if (req.token.admin == true) {
        Noticia.remove(req.params.id)
            .then(dados => res.status(200).jsonp(dados))
            .catch(e => res.status(500).jsonp({error: e}))
    } else {
        res.status(401).send()
    }
})


module.exports = router
