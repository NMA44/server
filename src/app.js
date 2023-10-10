import express from 'express';
import productsRouter from './routers/products.router.js';
import cartRouter from './routers/cart.router.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api', productsRouter, cartRouter);

app.listen(8080, ()=>{
    console.log("Servidor corriendo correctamente.")
})