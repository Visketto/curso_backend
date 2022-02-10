import mongoose from "mongoose";
import config from "../config/config.js";

mongoose.connect(config.mongo.baseUrl,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

export default class ContenedorMongoDb{
    constructor(collection,schema,timestamps){
        this.collection = mongoose.model(collection,new mongoose.Schema(schema,timestamps));
    };

    async getAll(){
        try{
            let data = await this.collection.find() //.populate('productos')//=> Para mostrar el objeto completo.
            return {status:"success",message:"Se ha encontrado la información.",payload:data}
        }catch(error){
            return {status:"error",message:"Error al buscar la información."+error}
        };
    };

    async getById(id){
        try{
            let data = await this.collection.findById(id);
            if(!data){
                return {status:"error",message:"No se ha encontrado la información."} //
            }else{
                return {status:"success",message:"Se ha encontrado la información.",payload:data}
            }
        }catch(error){
            return {status:"error",message:"Error al buscar la información."+error}
        };
    };

    async save(producto){
        try{
            let existe = await this.collection.findOne({title:{$eq:producto.title}});
            if(existe){
                return {status:"error",message:"El producto ya existe."}
            }else{
                let nuevo = await this.collection.create(producto);
                return {status:"success",message:"Se ha creado el producto.",payload:nuevo}
            }
        }catch(error){
            return {status:"error",message:"Error al crear el producto."+error}
        };
    };

    async createCart(){         
        try{           
            let resultado = await this.collection.create({productos:[]})                 
            resultado.save()
            let carrito = (JSON.parse(JSON.stringify(resultado)))         
            return {status:'sucess',message:"Se ha creado el carrito.",data:carrito._id}
        }catch(error){
            return {status:'error',message:error}
        };
    };

    async updateById(id,body){
        try{
            let resultado = await this.collection.findById(id);
            if(resultado){
                await resultado.updateOne(body);
                return {status:"success",message:"Se ha actualizado la información."};
            }
            return{status:"error",message:"No existe ese id."} //
        }catch(error){
            return {status:"error",message:"Error al actualizar la información."+error}
        };
    };

      async addProd(prodId,cartId){
        try{
            let resultado = await this.collection.findById(cartId).findOne({productos:prodId});
            console.log(resultado);
            if(resultado){
                return {status:"error",message:"El producto ya se encuentra agregado en el carrito."}
            }else{
                await this.collection.findByIdAndUpdate(cartId,{$push:{productos:prodId}});
                return {status:"success", message:"Se ha agregado el producto en el carrito."};
            }
        } catch(error){
            return {status:"error",message:"Error al agregar el producto al carrito."+error};
        };
    };

    /*async addProd(cartId,prodId){
        try{
            let result = await this.collection.updateOne({_id:cartId},{$push:{productos:prodId}})
            return {status:"success",message:result}
        }catch(error){
            return {status:"error",error:error}
        };
    };*/

    async deleteById(id){
        try{
            let producto = await this.collection.findById(id)
            if(producto){
                await this.collection.findByIdAndDelete(id);
                return {status:"success",message:"Se ha eliminado la información.",payload:producto}
            }
            return {status:"error",message:"No se ha encontrado la información."}
        }catch(error){
            return {status:"error",message:"Error al elimininar la información."+error} //
        };
    };

    async deleteProd(cartId,prodId){   
        try{      
            let carrito = await this.collection.findById(cartId)
            if(!carrito){
                return {status:"error",message:"No existe ese carrito."} //
            }
      
            let producto = await this.collection.findById(cartId).findOne({productos:prodId})
            if(!producto){
                return {status:"error",message:"No existe ese producto en el carrito."}
            } 
            await this.collection.findByIdAndUpdate(cartId,{$pull:{productos:prodId}})
      
            return {status:"success",message:"Se ha eliminado el producto del carrito."}
          }catch(error){
            return {status:"error",message:"Error al eliminar producto del carrito."+error}
        };
    };
};