import { Router } from 'express';
import ProductManager from '../productManager.js';
import { v4 as uuidv4 } from 'uuid';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';


const __fileName = fileURLToPath(import.meta.url);
const __dirName= dirname(__fileName);


const router = Router();

const productManager = new ProductManager(path.join(__dirName, '../products.json'));

router.get('/products', async (req, res)=>{
    try {
        const products = await productManager.getProducts();
        const limit = parseInt(req.query.limit) || products.length;
        const limitedProducts = products.slice(0, limit);

        res.status(200).json(limitedProducts)
    } catch (error) {
        res.status(400).json({message:"Ha ocurrido un error"});
    }
})

router.get('/products/:id', async (req, res)=>{
    const id = req.params.id;
    const product = await productManager.getProductById(id);
    if(product){
        res.status(200).json({message:'Producto encontrado exitosamente', user:product});
    }else{
        res.status(404).json({message:`El producto con id ${id} no existe en la base de datos.`})
    }    

})

router.post('/products', async (req, res)=>{
    try {
        const { body } = req;
        const newProduct = {
            id: uuidv4(),
            ...body
        }
        await productManager.addProduct(newProduct);
        res.status(200).json({message:"Producto agregado", product:newProduct});
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

router.put('/products/:id', async (req, res)=>{
    try {
        const {body} = req;
        const id = req.params.id;
        await productManager.updateProducts(id, body);
        const updatedUser = await productManager.getProductById(id);

        res.status(200).json({message:"Usuario actualizado con exito.", update: updatedUser});
    } catch (error) {
        res.status(400).json({message:"Algo salio mal"});
    }
})

router.delete('/products/:id', async (req, res)=>{
    try {
        const id = req.params.id;
        await productManager.deleteProducts(id);

        res.status(200).json({message: `El usuario con id ${id} fue eliminado.`});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

export default router;