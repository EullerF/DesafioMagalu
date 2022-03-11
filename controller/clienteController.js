require('dotenv').config()
const Produto = require('../models/Produtos')
const Cliente = require('../models/Clientes')

const URL_PRODUTO = process.env.URL_PRODUTO

module.exports = class clienteController {

    //Create 
    static async create(req, res) {
        const {name, email} = req.body
 
     if(!name){
         res.status(422).json({eror:'Insira o nome'})
         return
     }
     if(!email){
         res.status(422).json({eror:'Insira o e-mail'})
         return
     }
 
    const cliente = {
     name,
     email
    }
    // Validando se o e-mail está atrelado a outro Cliente
    const clientes = await Cliente.findOne({email: email})
    if(!clientes){  
        try{
         await Cliente.create(cliente)
        res.status(201).json({message: 'Cliente criado com sucesso'})
 
        } catch (error){
        res.status(500).json({error: error})
        }
    }
    else{
        res.status(422).json({eror:'E-mail já cadastrado'})
    }
    }
    // Ler apenas o Cliente desejado
    static async getOne(req, res) {
        const id = req.params.id
        try{
            const cliente = await Cliente.findOne({_id: id})
            if(!cliente){
    
                res.status(422).json({message:'Cliente inexistente'})
                return
            }
    
            res.status(200).json(cliente)
           } catch (error){
               res.status(500).json({error: error})
           }
        }
    // Ler todos os clientes com páginação
    static async getAll(req, res) {
        const pagina = req.params.page || 1;
        const limite = 5;
        const salto = (pagina - 1) * limite;
        try{
            const clientes = await Cliente.find().skip(salto).limit(limite);
            res.status(200).json(clientes)
        
           } catch (error){
               res.status(500).json({error: error})
           }
        }

       // Update
        static async update(req, res) {
        const id = req.params.id
        const {name, email} = req.body
        const cliente = {
        name,
        email
       }

        const clienteInfo = await Cliente.findOne({_id: id})
        const cliente1 = await Cliente.findOne({email: email})
            if(clienteInfo.email!==email && cliente1){
                res.status(422).json({
                message:'E-mail já está em uso'
             })
            return
            }
    
            try{
                 const atualizarCliente = await Cliente.updateOne({_id: id},cliente)

                 if(atualizarCliente.matchedCount===0){
                 res.status(422).json({message:'Cliente inexistente'})
                return
                 }
                 res.status(200).json(cliente)
                } catch (error){
                res.status(500).json({error: error})
                }
            
        }
    static async delete(req, res) {
    const id = req.params.id
    const cliente = await Cliente.findOne({_id: id})
        if(!cliente){
            res.status(422).json({message:'Cliente inexistente'})
            return
        }
        try{
            await Cliente.deleteOne({_id:id})
            res.status(200).json({message:'Cliente deletado com sucesso'})
            
           } catch (error){
             res.status(500).json({error: error})
           }
    }
    // Adicionando produtos a lista de favoritos
    static async addList(req, res) { 
    const id = req.params.id
    const {idP} = req.body
    const favorito = {
        idP
       }

    try{
        const cliente = await Cliente.findOne({_id: id})
        const produto = await Produto.findOne({_id: favorito.idP})
        if(!produto){
            res.status(422).json({message:'Produto inexistente'})
            return
            }

        if(!cliente){
            res.status(422).json({message:'Cliente inexistente'})
            return
            }
        const favoritos = [...new Set(cliente.favoritos)]
        favoritos.push(idP)

        // Garantindo que o produto favorito não seja duplicado antes de atualizar a lista
        const favoritosUnico = [...new Set(favoritos)]
        const atualizarCliente = await Cliente.updateOne({_id: id},{$set:{favoritos:favoritosUnico}})
        if(atualizarCliente.matchedCount===0){
            res.status(422).json({message:'Cliente inexistente'})
            return
            }
        const clienteNovosFavoritos = await Cliente.findOne({_id: id})
        res.status(200).json(clienteNovosFavoritos)
            } catch (error){
           res.status(500).json({error: error})
            }
    }
    // Listar Favoritos
    static async getList(req, res) {
        
    const id = req.params.id
    const pagina = req.params.page || 1;
    const limite = 3;
    let salto = (pagina - 1) * limite;
   
    try{
        const cliente = await Cliente.findOne({_id: id})
        if(!cliente){
            res.status(422).json({message:'Cliente inexistente'})
            return
        }
        const idFavoritos = [...new Set(cliente.favoritos)]
        const tamanho = idFavoritos.length
        
        let arrayFavoritos = []

            var indice = 0;
            while (indice < 3) {
            if(salto>=tamanho)
            {
                break;
            }
            
            const produto_favorito = await Produto.findOne({_id: idFavoritos[salto]})
            //Validando se há Review
            if(!produto_favorito.reviewScore){
            arrayFavoritos.push(
                {title:produto_favorito.title,
                 image:produto_favorito.image,
                 price:produto_favorito.price,
                 URL:URL_PRODUTO+produto_favorito._id})
            }
            else{
                arrayFavoritos.push(
                    {title:produto_favorito.title,
                     image:produto_favorito.image,
                     price:produto_favorito.price,
                     review:produto_favorito.reviewScore,
                     URL:URL_PRODUTO+produto_favorito._id})
            }
            indice=indice + 1;
            salto=salto + 1;
        }
        
            res.status(200).json(arrayFavoritos)
            } catch (error){
            res.status(500).json({error: error})
       }
    }



}