const mongoose = require ('mongoose')

const Produtos = mongoose.model('Produto',{
    price:Number,
    image:String,
    brand:String,
    title:String,
    reviewScore:Number,
})

module.exports = Produtos