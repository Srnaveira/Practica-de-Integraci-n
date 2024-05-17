import express from 'express';
import { __dirname } from './utils.js';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import cartsRouter from './routes/carts.routers.js';
import productsRouter from './routes/products.router.js';
import messagesRouter from './routes/messages.router.js';
import messageModel from './models/messages.model.js'
import dotenv from 'dotenv';

const PORT = 8080;

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));

dotenv.config()

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/api/message/', messagesRouter);


const httpServer = app.listen(PORT, () =>{
    console.log(`Listening on PORT: ${PORT}`)

})


mongoose.connect(process.env.MONGO_URL)
    .then(() =>{ console.log("Conexion sucefull")})
    .catch((error) => {console.error("Error en conexion con la BD", error)})


const socketServer = new Server(httpServer);



socketServer.on('connection', async socket =>{
    console.log("Nuevo cliente conectado");


    await messageModel.find({})
        .then((messages) =>{
                socket.emit('messageLogs', messages)
        })       

    socket.on('newMessage', async (message) => {
        try {
            console.log({ message })
            await messageModel.create(message);
            socket.emit('newMessage', message);
        } catch (error) {
            console.error('Error al agregar el mensaje:', error.message);
            socket.emit('newMessage', 'Error al agregar el mensaje');
        }
    })

    socket.on('messageLogs', async () => {
        try {
            let messages = await messageModel.find({}) 
            socket.emit('messageLogs', messages)
        } catch (error) {
            console.error('Error al enviar mensajes:', error.message);
            socket.emit('messageLogs', 'Error al agregar el mensaje');
        }
    })

})




