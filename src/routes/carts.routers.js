import { Router } from 'express';
import cartsModel from '../models/carts.model.js'

const router = Router();


router.post('/', async (req, res)=>{
    try {
        const newCart = await cartsModel.create({})
        res.status(201).json({message:'Se a creado correctamente el nuevo cart', cart: newCart});
    } catch (error) {
        console.error("Se produjo algun error al generar el Cart", error);
        res.status(500).json({message: "Error interno del servidor", error: error});
    }
})


router.get('/', async (req, res)=>{
    try {
        let carts = await cartsModel.find()
        res.status(200).json({message: "Se envio el contenido de todos los carritos", cart: carts});
    } catch (error) {
        console.error("Se produjo algun error al traer el contenido del Cart", error);
        res.status(500).json({message: "Error interno del servidor", error: error});
    }
})


router.get('/:cid', async (req, res)=>{
    try {
        let { cid } = req.params
        
        const cartContent = await cartsModel.findOne({_id: cid})

        if(cartContent){
            res.status(200).json({message: "Se encontro correctamente el contenido del carito", cart: cartContent});
        } else {
            res.status(404).json({message: "No existe ese producto"});
        }
    } catch (error) {
        console.error("Se produjo algun error al traer el contenido del Cart", error);
        res.status(500).json({message: "Error interno del servidor", error: error});
    }
})


router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = 1;
        // Verificar si el producto ya está en el carrito
        const existingCart = await cartsModel.findOne({ _id: cid, "product.idP": pid });

        if (existingCart) {
            // Actualizar la cantidad si el producto existe
            await cartsModel.updateOne(
                { _id: cid, "product.idP": pid },
                { $set: { "product.$.quantity": existingCart.product[0].quantity + quantity } }
            );
        } else {
            // Agregar el producto al carrito si no existe
            await cartsModel.updateOne({ _id: cid }, { $push: { product: { idP: pid, quantity } } });
        }

        res.status(200).json({ message: "Producto agregado correctamente" });
    } catch (error) {
        console.error("Hubo un problema al agregar ese producto", error);
        res.status(404).json({ message: "Producto o carrito no encontrado", error });
    }
});



export default router;