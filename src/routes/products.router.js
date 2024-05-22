import { Router } from 'express';
import productsModel from '../models/products.model.js'

const router = Router();


router.get('/', async (req, res) => {
    try {
        const limite = parseInt(req.query.limit);
        if(limite){
            console.log("deberia entrar aqui")
            let products = await productsModel.find().limit(limite)
            res.status(200).json(products);
        } else {
            let products = await productsModel.find()
            res.status(200).json(products);
        }    
    } catch (error) {
        console.error("error al leer el archivo", error)
        res.status(500).json({ error: "Error interno del servidor" })
    }

})


router.get('/:pid', async (req, res) => {
    try {
        let pId = req.params.pid;
        let products = await productsModel.findById(pId)
        if(products){
            res.status(200).json(products); 
        } else {
            res.status(404).json({message: "El producto Solicitado No existe"});
        }

    } catch (error) {
        console.log("hubo algun problema: ", error)
        res.status(500).json({ error: "Error interno del servidor" })
    }

})

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, status, category, stock } = req.body
        if(!title || !description || !price || !code || !category || !stock ) {
            res.status(500).json({ message: "Faltan parametros", error: error.message});
        } else {
            let productAdd = await productsModel.create({title, description, price, thumbnail, code, status, category, stock})
            res.status(201).json({message: "Product Agregado Correctamente", product: productAdd});
        }
  
    } catch (error) {
        console.error("Error al agregar el producto: ", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message});
    }
})

router.put('/:pid', async (req, res) => {
    try {
        let { pid } = req.params;
        let productToreplace = req.body
        let productUpdate = await productsModel.updateOne({ _id: pid }, productToreplace)
        // Envía una respuesta exitosa
        res.status(200).json({ message: "Producto actualizado correctamente.", product: productUpdate});
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        // Envía una respuesta con Error
        res.status(500).json({  message: "Error interno del servidor", error: error.message}); 
    }

})

router.delete('/:pid', async (req, res) => {
    try {
        let { pid } = req.params
        let result = await productsModel.deleteOne({ _id: pid })
        res.status(200).json({message: "Producto borrado correctamente", result})
    } catch (error) {
        console.error("Error al borrar el Producto", error)
        res.status(500).json({message: "Error interno del servidor", error: error.message})
    }

})

export default router;