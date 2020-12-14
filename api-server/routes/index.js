const express = require('express')
const router = express.Router()

var Utilizador = require('../controllers/utilizador')
// ...

/* GET home page. */
router.get('/', function(req, res, next) {
  res.jsonp("I'm working")
})

module.exports = router
