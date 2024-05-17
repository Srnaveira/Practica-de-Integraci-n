import { Router } from 'express';
import { __dirname } from "../utils.js"
import messageModel from '../models/messages.model.js'
import express from 'express';

const router = express.Router();

router.get('/chat', async (req, res) => {
    try {
        res.render('chat', {});
    } catch (error) {
        console.error('Error al renderizar la plantilla:', error);
        res.status(500).send('Error al renderizar la plantilla');
    }
});


router.get('/', async (req, res) =>{
    try {
        let message = await messageModel.find({});
        res.send({result: "success", playload: message}); 

    } catch (error) {
        console.error(error);

    }
});




export default router;