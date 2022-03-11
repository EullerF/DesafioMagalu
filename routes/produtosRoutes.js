const router = require('express').Router()
const produtosController = require('../controller/produtosController')


 router.get('/page/:page' , produtosController.getAll)

 module.exports = router