const router = require('express').Router()
const Produto = require('../models/Produtos')
const produtosController = require('../controller/produtosController')


 router.get('/page/:page' , produtosController.getAll)

 module.exports = router