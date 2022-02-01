import admin from "firebase-admin";
import config from '../config.js';

admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
    databaseURL:"https://ecommerce-f8836.firebase.io"
})

const db = admin.firestore();

export default class ContenedorFirebase{
    constructor(collection){
        this.collection = db.collection(collection)
        this.prodCollection = db.collection("productos");
    };

    async getAll(){
        try{
            let data = await this.collection.get()
            let resultado = data.docs.map(res =>{
                let info = res.data()
                info.id = res.id
                return info
            });
            return {status:"success",message:"Se ha encontrado la información.",payload:resultado};
        }catch(error){
            return {status:"error",message:"Error al buscar la información."+error};
        };
    };

    async getById(id){
        try{
            let data = await this.collection.doc(id).get();
            let resultado = data.data();
            console.log(resultado);

            if(!resultado){
                return {status:"error",message:"No se ha encontrado la información."};
            }else{
                resultado.id = data.id;
                return {status:"success",message:"Se ha encontrado la información.",payload:resultado};
            }
        }catch(error){
            return {status:"error",message:"Error buscando el producto"+error};
        };
    };

    async save(producto){
        try{
            let existe = await this.collection.where("title","==",producto.title).get();
            if(!existe.empty){
                return {status:"error", message:"El producto ya existe."};
            }else{
                producto.stock = parseInt(producto.stock);
                producto.price = parseInt(producto.price);
                await this.collection.add(producto);
                return {status:"success",message:"Se ha creado el producto.",payload:producto};
            }
        }catch(error){
            return {status:"error",message:"Error al crear el producto."+error};
        };
    };

    async createCart(){         
        try{            
            let resultado = this.collection.doc();
            await resultado.set({productos:[],timestamp:admin.firestore.Timestamp.now()});                             
            return {status:'sucess',message:"Se ha creado el carrito.",data:resultado.id}
        }catch(error){
            return {status:'error',message:"Error al crear carrito."+error}
        };
    };

    async updateById(id,body){
        try{
            let collection = this.collection.doc(id);
            let data = await collection.get();
            let producto = data.data();

            if(!producto){
                return {status:"error",message:"El producto no existe."};
            }else{
                body.stock = parseInt(body.stock);
                body.price = parseInt(body.price);
                await collection.update(body);
                return {status:"success",message:"Se ha actualizado la información."};
            }
        }catch(error){
            return {status:"error",message:"Error al actualizar la información."+error}
        };
    };

    async addProd(prodId,cartId){
        try{
            let collection = await this.collection.doc(cartId).get();
            let carrito = collection.data();

            if(!carrito){
                return {status:"error",message:"El carrito no existe."};
            }else{
                let data = await this.prodCollection.doc(prodId).get();
                let producto = data.data();
                if(!producto){
                    return {status:"error",message:"El producto no existe."};
                }else{
                    producto.id = prodId;
                    let existe = carrito.productos.find(p => p === prodId);
                    if(existe){
                        return {status: "error", message: "El producto ya se encuentra agregado en el carrito."};
                    }else{
                        let productos = [
                            ...carrito.productos,
                            producto.id
                        ];
                        await this.collection.doc(cartId).set({productos:productos,timestamp:admin.firestore.Timestamp.now()}); //
                        return {status:"success",message:"Se ha agregado el producto en el carrito."};
                    };
                };
            };
        }catch(error){
            return {status:"error",message:"Error al agregar el producto al carrito."+error};
        };
    };

    async deleteById(id){
        try{
            let collection = this.collection.doc(id)
            let resultado = await collection.get();
            let data = resultado.data();
            if(!data){
                return {status:"error",message:"No se ha encontrado la información."};
            }else{
                await collection.delete();
                return {status:"success", message:"Se ha eliminado la información."}
            }
        }catch(error){
            return {status:"error",message:"Error al eliminar la información."+error}
        };
    };

    async deleteProd(cartId,prodId){
        try{
            let collection = await this.collection.doc(cartId).get();
            let carrito = collection.data();

            if(!carrito){
                return {status:"error",message:"No existe ese carrito."};
            }else{
                let existe = carrito.productos.filter(p => p.id === prodId);
                if(!existe){
                    return {status:"error",message:"No existe el producto en el carrito."};
                }else{
                    let producto = carrito.productos.filter(p => p !== prodId);
                    await this.collection.doc(cartId).set({productos: producto});
                    return {status:"success",message:"Se ha eliminado el producto del carrito."};
                };
            };
          }catch(error){
                return {status:"error",message:"Error al eliminar producto del carrito."+error}
        };
    };
};