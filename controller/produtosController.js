const Produto = require('../models/Produtos')


module.exports = class clienteController {
    static async getAll(req, res) {
     const pagina = req.params.page || 1;
     const limite = 4;
     const salto = (pagina - 1) * limite;
        try{
            const produtos = await Produto.find().skip(salto).limit(limite);
            res.status(200).json(produtos)
    
        } catch (error){
           res.status(500).json({error: error})
       }
    }
}