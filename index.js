require('dotenv').config()
const express = require ('express')
const mongoose = require('mongoose')
const app = express()

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

const clienteRoutes = require('./routes/clienteRoutes')
app.use('/cliente', clienteRoutes)

const produtosRoutes = require('./routes/produtosRoutes')
app.use('/produto', produtosRoutes)


const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.xogwv.mongodb.net/bancoapi?retryWrites=true&w=majority`
    )
    .then(()=>{
        app.listen(3000)
        console.log('Conectado ao Banco')
    })
    .catch((erro)=>{
        console.log(erro)
    })
