require('dotenv').config()
const router = require('express').Router()
const clienteController = require('../controller/clienteController')

const URL_PRODUTO = process.env.URL_PRODUTO

router.post('/' , clienteController.create)
router.get('/page/:page' , clienteController.getAll)
router.get('/:id' , clienteController.getOne)
router.patch('/:id' , clienteController.update)
router.delete('/:id' ,clienteController.delete)
router.patch('/favoritos/:id' , clienteController.addList)
router.get('/favoritos/:id/:page', clienteController.getList)

 module.exports = router