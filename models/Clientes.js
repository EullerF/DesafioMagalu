const mongoose = require ('mongoose')

const Cliente = mongoose.model('Cliente',{
    name:String,
    email:String,
    favoritos:[]
})

module.exports = Cliente