import fs from 'fs';

export default class ProductManager{
    constructor(path){
        this.path = path;
        this.nextId = 1;
        this.products = this.getProducts(this.path);
        if (!Array.isArray(this.products)) {
            this.products = [];
        }
        
    }

    async addProduct(user){

        const {id , title, description, price, thumbnail, code, stock} = user

        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.error("Se deben completar todos los campos.");
            return;
        }
        
        const products = await this.getProducts(this.path);

        let codeRepeated = products.some(p => p.code === code);


        if(codeRepeated){
            throw new Error(`El codigo ${code} ya existe.`);
        }
        else{
            const users =  await getJSONFromFile(this.path);
            const newUser = {id ,title, description, price, thumbnail, code, stock};
            users.push(newUser);
            return saveJSONToFile(this.path, users);
        };
    };

    getProducts(){ 
        return getJSONFromFile(this.path);
    };

    async getProductById(id){
        const busqueda = await this.getProducts(this.path);
        const filtro = busqueda.find((producto)=>{    
            return producto.id === id;
        });

        if(filtro){
            return filtro;
        }
    };

    async updateProducts(id, newData){
        const products = await this.getProducts();
        const index = products.findIndex((product) =>{
            return product.id === id;
        })

        if(index === -1){
            console.log("producto no encontrado");
            return;
        }

        const {newTitle, newDescription, newCode, newPrice, newStatus, newStock, newCategory, newThumbnail,} = newData;
        
        products[index] = {id: id, 
            title: newTitle !== undefined ? newTitle : products[index].title,
            description: newDescription !== undefined ? newDescription : products[index].description,
            code: newCode !== undefined ? newCode : products[index].code,
            price: newPrice !== undefined ? newPrice : products[index].price,
            status: newStatus !== undefined ? newStatus : products[index].status,
            stock: newStock !== undefined ? newStock : products[index].stock,
            category: newCategory !== undefined ? newCategory : products[index].category,
            thumbnail: newThumbnail !== undefined ? newThumbnail : products[index].thumbnail
        };

        try {
            await saveJSONToFile(this.path, products);
        } catch (error) {
            throw new Error("Hubo un error al actualizar los productos ");
        };
    };

    async deleteProducts(id){
        const products = await this.getProducts();
        const index = products.findIndex((product)=> product.id === id);

        if(index === -1){
            throw new Error("producto no encontrado");
        };

        products.splice([index],1);

        try {
            await saveJSONToFile(this.path, products, 'utf-8');
        } catch (error) {
            throw new Error('no se pudo borrar el producto');
        };
        
    };

};

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



