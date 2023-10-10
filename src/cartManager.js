import fs from 'fs';


export default class CartManager{
    constructor(path){
        this.path = path;
    }

    async getCarts(){
        const carts = await getJSONFromFile(this.path);
        return carts;
    }

    async createCart(cart){
        const carts = await this.getCarts();
        const newCart = cart;
        carts.push(newCart);
       return await saveJSONToFile(this.path, carts);
    }

    async addProductToCart(pId, cId){
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cId);
    
        if (cartIndex !== -1) {
            const cart = carts[cartIndex];
            const productIndex = cart.products.findIndex(p => p.id == pId);
            
    
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                const newProduct = {
                    id: pId,
                    quantity: 1
                };
                cart.products.push(newProduct);
            }
            carts[cartIndex] = cart;
            await saveJSONToFile(this.path, carts);
        }else{
            throw new Error(`El carrito con id ${cId} no existe.`)
        }    
    }

    async getCartById(id){
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id == id);
        return cart;
    }
}

// Utilities

const existFile = async (path) => {
    try {
      await fs.promises.access(path);
      return true;
    } catch (error) {
      return false;
    }
  };

const getJSONFromFile = async (path) => {
    if(!await existFile(path)){
        return [];
    }

    let content;

    try {
        content = await fs.promises.readFile(path, 'utf-8');
    } catch (error) {
        throw new Error('el archivo no pudo ser leido.');
    };

    try {
        return JSON.parse(content);
        
    } catch (error) {
        throw new Error('El archivo no tiene formato JSON');
    };
};

const saveJSONToFile = async (path, data) => {
    const content = JSON.stringify(data, null, '\t');
    try {
        await fs.promises.writeFile(path, content, 'utf-8');
    } catch (error) {
        throw new Error('El archivo no pudo ser creado.');
    };
};
    
