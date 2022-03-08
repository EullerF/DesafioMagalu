require('dotenv').config()
const router = require('express').Router()
const Produto = require('../models/Produtos')
const Cliente = require('../models/Clientes')

const URL_PRODUTO = process.env.URL_PRODUTO


// Post - Criar Cliente
router.post('/' , async(req,res)=>{

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
         // Add ao mongo
         await Cliente.create(cliente)
        res.status(201).json({message: 'Cliente criado com sucesso'})
 
        } catch (error){
        res.status(500).json({error: error})
        }
    }
    else{
        res.status(422).json({eror:'E-mail já cadastrado'})
    }
 
 })
// Read - Ler Cliente com limite de páginas
router.get('/page/:page' , async(req,res)=>{

    
    const pagina = req.params.page || 1;
    const limite = 5;
    const salto = (pagina - 1) * limite;
    try{
        const clientes = await Cliente.find().skip(salto).limit(limite);
        res.status(200).json(clientes)
    
       } catch (error){
           res.status(500).json({error: error})
       }
})
// Ler apenas o Cliente desejado
router.get('/:id' , async(req,res)=>{

    //Pegando o id
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
})

// Update - Atualizar
//PATCH
router.patch('/:id' , async(req,res)=>{
    //Pegando o id
    const id = req.params.id
    // Buscando Clientes
    const {name, email} = req.body
    const cliente = {
        name,
        email
       }
    // Verificando se o email está atrelado a outro cliente
    // Pegando as Infos do cliente que será atualizado
    const clienteInfo = await Cliente.findOne({_id: id})
    // Buscar cliente que já tenha aquele e-mail
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
    
})

// Delete - Deletar um Cliente
router.delete('/:id' , async(req,res)=>{
    const id = req.params.id
    // Validando a existencia do cliente
    const cliente = await Cliente.findOne({_id: id})
        if(!cliente){
            res.status(422).json({message:'Cliente inexistente'})
            return
        }
        //Deletando o cliente
        try{
            await Cliente.deleteOne({_id:id})
            res.status(200).json({message:'Cliente deletado com sucesso'})
            
           } catch (error){
             res.status(500).json({error: error})
           }
})

// Produto favoritado será adicionado na lista de favoritos do Cliente
router.patch('/favoritos/:id' , async(req,res)=>{

    //Pegando o id
    const id = req.params.id
    //Pegando id do Produto
    const {idP} = req.body
    const favorito = {
        idP
       }

    try{
        const cliente = await Cliente.findOne({_id: id})
        //Buscando produto pelo ID 
        const produto = await Produto.findOne({_id: favorito.idP})
        if(!produto){
            res.status(422).json({message:'Produto inexistente'})
            return
        }
        if(!cliente){
            res.status(422).json({message:'Cliente inexistente'})
            return
        }
        // Lista de favoritos
        const favoritos = [...new Set(cliente.favoritos)]
        // Adicionando novo favorito
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
})

// Listar os favoritos do cliente
router.get('/favoritos/:id/:page', async(req,res)=>{

    //Pegando o id do Cliente
    const id = req.params.id
    const pagina = req.params.page || 1;
    const limite = 3;
    let salto = (pagina - 1) * limite;
   
    try{
        //Buscando dados do Cliente no Banco
        const cliente = await Cliente.findOne({_id: id})
        //Validação
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
})

 module.exports = router