import fs from 'fs';
import config from '../config.js';

//--------------------------------- Random ID -----------------------------------------//
const makeRandomId= (length) =>{
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i = 0; i < length; i++ ){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    };   
   return result;
};
//--------------------------------------------------------------------------------------//

export default class ContenedorArchivo{
    constructor(file_endpoint){
        this.url = `${config.fileSystem.baseUrl}${file_endpoint}`
    };

    async getAll(){
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');
            let obj = JSON.parse(data);
            let productos = [];                                        

            obj.map((p)=>{
                productos.push(p);
            });     
            return productos;
        }catch(err){
            return {status:'error',message:'Error al obtener la información.'}
        };
    };

    async getById(id){
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');
            let productos = JSON.parse(data);
            let producto = productos.find(prod => prod.id == id);

            if(producto){
                return {status:"success",producto:producto,message:'Se encontró la información.'}
            }else{
                return {status:'error',producto:null,message:'No se encontró la información.'}
            }
        }catch(err){
            return {status:'error',message:'Error al obtener la información.'}
        };
    };

    async save(producto){
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');
            let productos = JSON.parse(data);

            const timestamp = Date.now();
            const time = new Date(timestamp);
            const productTime = time.toTimeString().split(" ")[0];

            if(productos.some(prod=>prod.title===producto.title)){
                return {status:"error",message:'El producto ya existe.'}
            }else{
                const price = parseFloat(producto.price);
                const stock = parseInt(producto.stock);

                let dataProd = {
                    id:productos.length+1,
                    timestamp:productTime,
                    title:producto.title,
                    description:producto.description,
                    code:producto.code,
                    thumbnail:producto.thumbnail,
                    price:producto.price,
                    stock: stock
                }
                productos.push(dataProd);

                try{
                    await fs.promises.writeFile(this.url, JSON.stringify(productos,null,2));
                    return {status:'success', message:'Producto creado.'}
                }catch(err){
                    return {status:'error', message:'No se pudo crear el producto.'}
                }
            }
        }catch{
            const timestamp = Date.now();
            const time = new Date(timestamp);
            const productTime = time.toTimeString().split(" ")[0];

            let dataProd = {
                id: 1,
                timestamp:productTime,
                title:producto.title,
                description:producto.description,
                code:producto.code,
                thumbnail:producto.thumbnail,
                price:producto.price,
                stock: stock
            }
            try{
                await fs.promises.writeFile(this.url, JSON.stringify([dataProd],null,2));
                return {status:"success",message:"Producto creado."}
            }catch(error){
                return {status:"error",message:"No se pudo crear el producto:"+error}
            };
        };
    };

    async createCart(){         
        try{
            let data =await fs.promises.readFile(this.url,'utf-8');
            let nuevoCarrito=JSON.parse(data);           
            let carrito = {
                id:makeRandomId(7),
                timestamp:new Date().toLocaleString(),
                products:[]
            }                                
            nuevoCarrito.push(carrito);
            try{
                await fs.promises.writeFile(this.url,JSON.stringify(nuevoCarrito,null,2));                                        
                return {status:"success",message:"El carrito ha sido creado con éxito."}
            }catch(error){
                return {status:"error",message:"No se pudo crear el carrito."+error}
            }               
        }catch{             
            let carrito = {
                id:makeRandomId(7),
                timestamp:new Date().toLocaleString(),
                products:[]                
            }    
            try{
                await fs.promises.writeFile(this.url,JSON.stringify([carrito]),null,2);
                return {status:"success",message:"El carrito ha sido creado con éxito."}
            }catch(error){
                return {status:"error",message:"Error al crear carrito."+error}
            };
        };
    };

    async updateById(id,body){
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');
            let productos = JSON.parse(data);

            if(!productos.some(prod=>prod.id===id)) return {status:"error",message:"No existe ese producto."};
            let result = productos.map(prod=>{
                if(prod.id===id){
                        body = Object.assign({id:prod.id,...body});
                        return body;
                }else{
                    return prod;
                }
            })
            try{
                await fs.promises.writeFile(this.url,JSON.stringify(result,null,2));
                return {status:"success",message:"Producto actualizado."}
            }catch{
                return {status:"error",message:"Error al actualizar el producto."}
            }
        }catch(error){
            return {status:"error",message:"Fallo al actualizar el producto: "+error}
        };
    };

    async addProd(prodId,id){
        try{
            const data = await fs.promises.readFile('./files/productos.json',"utf-8");
            const productos = JSON.parse(data);
            const productoAgregado = productos.find(p => p.id === prodId);
            const dataCarritos = await fs.promises.readFile(this.url,"utf-8");
            const carritos = JSON.parse(dataCarritos);
            let carrito = carritos.find(c => c.id === id);
            if(!carrito){
                return {status:"error",message:"No existe ese carrito."}
            }

            let otroCarrito = carritos.filter(c => c.id !== id);
            let carritoProd = carrito.products.find(p => p.id === prodId);
            if(carritoProd){
                return {status:"error",message:"El producto ya se encuentra añadido en el carrito."};
            }else{
                carrito.products = [...carrito.products,productoAgregado];
                carrito = [...otroCarrito,carrito]
                await fs.promises.writeFile(this.url,JSON.stringify(carrito,null,2));
                return {status:"success",message:"El producto se ha añadido al carrito."}
            }
        }catch(error){
            return {status:"error",message:"Error al añadir el producto al carrito."+error};
        };
    };

    async deleteById(id){
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');
            let productos = JSON.parse(data);
            let productoFiltrado = productos.findIndex(prod => prod.id === id);

            if((productoFiltrado != -1 )){
                productos.splice(productoFiltrado,1);
        }else{
            return {status:'error',message:'No existe el ID.'}
            }
            try{
                await fs.promises.writeFile(this.url, JSON.stringify(productos,null,2));
                return {status:"success", message:"Se ha eliminado la información."}
            }catch(error){
                return {status:"error",message:"No se pudo eliminar la información."+error}
            }  
        }catch(err){
            return {status:'error',message:'Error al eliminar la información.'}
        }; 
    };

    async deleteProd(idNum,productId){
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');
            let carts = JSON.parse(data);
            let cart = carts.find(cart => cart.id === idNum);
            let cartIndex = carts.findIndex(cart => cart.id === idNum);
            let productIndex = cart.products.findIndex(prod => prod.id === productId);
            
            if(productIndex > -1){
                cart.products.splice(productIndex,1);
                carts.splice(cartIndex,1,cart);
                try{
                    await fs.promises.writeFile(this.url, JSON.stringify(carts,null,2))
                    return {status:"success",message:`El producto fue eliminado.`};
                }catch(error){
                    return {status:"error",message:'No se pudo eliminar el producto del carrito.'+error};
                };
            };
        }catch(error){
            return {status:"error",message:error};
        };
    };

    async deleteAll(){
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');
            let productos = JSON.parse(data);
            productos = [];

            try{
                await fs.promises.writeFile(this.url, JSON.stringify(productos,null,2));
                return {status:"success", message:"Todos los productos han sido eliminados."}
            }catch(error){
                return {status:"error",message:"No se pudieron eliminar los productos:"+error}
            }  
        }catch(err){
            return {status:'error',message:'Error al leer.'}
        }; 
    };
};