import fs from "fs";
import __dirname from "../utils.js";
//import Contenedor from "./Contenedor.js";
const cartURL = __dirname+`/files/carrito`;
const prodURL = __dirname+'/files/productos';

//--------------------------------- Random ID -----------------------------------------//
const makeRandomId= (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i = 0; i < length; i++ ){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    };   
   return result;
};
//--------------------------------------------------------------------------------------//

let carts = [];

class Carrito{

    async createCart(){
        try {
            const createCart={
                id: makeRandomId(7),
                date: new Date().toLocaleString(),
                products: []
            };

            carts = [...carts,createCart];
            await fs.promises.writeFile(cartURL, JSON.stringify(carts,null,2));
            return createCart;
        }catch(error){
            return{status:"error",message:"No se pudo crear el carrito"+error}
        };
    };

    async addProd(prodId,id){
        try {
            const fileProducts = await fs.promises.readFile(prodURL,"utf-8");
            const products = JSON.parse(fileProducts);
            const productToAdd = products.find(p => p.id === prodId);
            const fileCarts = await fs.promises.readFile(cartURL,"utf-8");
            const allCarts = JSON.parse(fileCarts);
            let carts = allCarts.find(c => c.id === id);
            let otherCarts = allCarts.filter(c => c.id !== id);

            carts.products = [...carts.products, productToAdd];
            carts = [...otherCarts,carts]
            await fs.promises.writeFile(cartURL, JSON.stringify(carts,null,2));
            return carts;
        }catch(error){
            return{status:"error",message:"No se pudo añadir el producto"+error};
        };
    };

    async getCart(id){
        try{
            let data = await fs.promises.readFile(cartURL,"utf-8");
            let cart = JSON.parse(data).find(c => c.id === id).products;

            if(!cart){
                throw new Error(`El carrito no existe`);
            }else{
                return cart;
            };
        }catch(error){
            return{status:"error",message:"No se pudo obtener el carrito"+error};
        };
    };

    async deleteCart(id){
        try{
            let data = await fs.promises.readFile(cartURL,'utf-8');
            let carts = JSON.parse(data);
            let FilterCart = carts.findIndex(cart => cart.id === id);

            if((FilterCart != -1 )){
                carts.splice(FilterCart,1);
        }else{
            return{status:'error', message:'No existe el ID.'};
            }
            try{
                await fs.promises.writeFile(cartURL, JSON.stringify(carts,null,2));
                return{status:"success", message:"El carrito fue eliminado."};
            }catch(error){
                return{status:"error",message:"No se pudo eliminar el carrito."+error};
            }  
        }catch(err){
            return{status:'error',message:'No se encontró el id.'};
        }; 
    };

    async deleteProd(idNum,productId){
        try{
            let data = await fs.promises.readFile(cartURL,'utf-8');
            let carts = JSON.parse(data);
            let cart = carts.find(cart => cart.id === idNum);
            let cartIndex = carts.findIndex(cart => cart.id === idNum);
            let productIndex = cart.products.findIndex(prod => prod.id === productId);
            
            if(productIndex > -1){
                cart.products.splice(productIndex,1);
                carts.splice(cartIndex,1,cart);
                try{
                    await fs.promises.writeFile(cartURL, JSON.stringify(carts,null,2))
                    return {status:"success",message:`El producto fue eliminado`};
                }catch(error){
                    return {status:"error",message:'No se pudo eliminar el producto del carrito'+error};
                };
            };
        }catch(error){
            return {status:"error",message:error};
        };
    };
};

export default Carrito;