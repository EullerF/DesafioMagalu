const router = require('express').Router()
const Produto = require('../models/Produtos')


// Exibir produtos com limite por página de 4
 router.get('/page/:page' , async(req,res)=>{

    const pagina = req.params.page || 1;
    const limite = 4;
    const salto = (pagina - 1) * limite;
    try{
        const produtos = await Produto.find().skip(salto).limit(limite);
        res.status(200).json(produtos)
    
       } catch (error){
           res.status(500).json({error: error})
       }
})

 module.exports = router