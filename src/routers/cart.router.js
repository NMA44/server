import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import CartManager from '../cartManager.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __fileName = fileURLToPath(import.meta.url);
const __dirName= dirname(__fileName);


const router = Router();

const cartManager = new CartManager(path.join(__dirName, '../carrito.json'));


router.post('/cart', async (req, res)=>{
    const newCart = {
        id: uuidv4(),
        products: []
    }

    try {
        await cartManager.createCart(newCart);
        res.status(400).json({message: `Carrito creado.`});
    } catch (error) {
        res.status(400).json({message: error.message})
    }
     
})

router.post('/cart/:cid/product/:pid', async (req, res)=>{
    const cId = req.params.cid;
    const pId = req.params.pid;
    try {
        await cartManager.addProductToCart(pId, cId);
        res.status(200).json({message:`Producto con id ${pId} agregado al carrito.`})
    } catch (error) {
        res.status(400).json({message: "No se pudo agregar al carrito.", error: error.message});
    }   

})

router.get('/cart/:cid', async (req, res)=>{
    const id = req.params.cid;
    try {
        const cart = await cartManager.getCartById(id);
        res.status(200).json({products: cart.products});  
    } catch (error) {
        res.status(400).json({message:"Hubo un error al tratar de leer el carrito", error: error.message})
    }

})

router.get('/cart', async (req, res)=>{
    
    try {
        const cart = await cartManager.getCarts();
        res.status(200).json({products: cart});  
    } catch (error) {
        res.status(400).json({message:"Hubo un error al tratar de leer el carrito", error: error.message})
    }

})

export default router;