/**
 * Modulo de conexão com o banco de dados
 * Uso de framework mongoose
 */

// importação do mongoose
// Não esquecer de instalar o modulo (npm i mongoose)
const mongoose = require('mongoose')

// configuração do banco de dados
// ip/link do servidor, autenticação , nome do banco
const url = 'mongodb+srv://admin:123Senac@cluster0.07vyv.mongodb.net/dbnotes'

//validação (evitar a abertura de varias conexões)
let connected = false

// metodo para conectar com o banco de dados
const connectDB = async () => {
    // se não estiver conectado
    if (!connected) {
        // conectar com o banco de dados
        try {
            await mongoose.connect(url)
            connected = true
            console.log("MondoDB Conectado")
            return true // verificação para o main
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

// metodo para desconectar o banco de dados
const disconnectDB = async () => {
    // se estiver conectado 
    if (connected) {
        // desconectar
        try {
            await mongoose.disconnect(url) // desconectar
            connected = false
            console.log("MongoDB Desconectado")
        } catch (error) {
            console.log(error)
        }
    }
}

// Exportar para o main os metodos conectar e desconectar
module.exports = { connectDB, disconnectDB }