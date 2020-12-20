const express = require('express')
const router = express.Router()
const crypto = require('../util/crypto')

const Utilizador = require('../controllers/utilizador')


function filter(user) {
    user.hashedPassword = undefined
    user.salt = undefined
    user.__v = undefined
    return user
}


// GET /utilizadores
router.get('/', function(req, res) {
    Utilizador.list()
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// GET /utilizadores/:id
router.get('/:id', function(req, res) {
    Utilizador.lookup(req.params.id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(500).jsonp(error))
})

// POST /utilizadores
router.post('/', function(req, res) {
    const user = req.body

    user.admin = false

    var hash = crypto.hasher(user.pass, crypto.generateSalt())
    user.hashedPassword = hash.hashedPassword
    user.salt = hash.salt
    user.pass = undefined

    Utilizador.insert(user)
        .then(data => res.status(201).jsonp(filter(data)))
        .catch(error => res.status(500).jsonp(error))
})

// POST /utilizadores/login
router.post('/login', function(req, res) {
    Utilizador.credentials(req.body.username)
        .then(data => {
            if (crypto.compare(req.body.pass, data)) {
                res.status(200).send()
            } else {
                res.status(401).send()
            }
        })
        .catch(error => res.status(500).jsonp(error))
})

// PUT /utilizadores/:id
router.put('/:id', function(req, res) {
    Utilizador.edit(req.params.id, req.body)
        .then(data => res.status(200).jsonp(filter(data)))
        .catch(error => res.status(500).jsonp(error))
})

// DELETE /utilizadores/:id
router.delete('/:id', function(req, res) {
    Utilizador.remove(req.params.id)
        .then(data => res.status(200).jsonp(filter(data)))
        .catch(error => res.status(500).jsonp(error))
})

module.exports = router
