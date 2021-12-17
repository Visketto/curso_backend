import {database} from "../config.js";

export default class contenedorProductos{
    constructor(){
        database.schema.hasTable('productos').then(result=>{
            if(!result){
                database.schema.createTable('productos',table=>{
                    table.increments('id');
                    table.timestamps(true,true);
                    table.string('title',100).notNullable();
                    table.string('description',200);
                    table.string('code').notNullable();
                    table.string('thumbnail',200).notNullable(),
                    table.integer('price').notNullable();
                    table.integer('stock').notNullable().defaultTo(0)
                }).then(result=>{
                    console.log("Tabla de productos creada")
                });
            };
        });
    };

    getProducts = async ()=>{
        try{
            let productos = await database.select().table('productos');
            return {status:"success",payload:productos}
        }catch(error){
            return {status:"error",message:"Error en encontrar los productos"+error}
        };
    };

    getProductById = async (id)=>{
        try{
            let producto = await database.select().table('productos').where('id',id).first();
            if(producto){
                return {status:"success",payload:producto}
            }else{
                return{status:"error",message:"No se ha encontrado el producto"}
            }
        }catch(error){
            return {status:"error",message:"Error en encontrar el producto"+error}
        };
    };

    registerProduct = async (producto) =>{
        try{
            let exists = await database.table('productos').select().where('title',producto.title).first();
            if(exists) return {status:"error",message:"El producto ya existe"}
            
            let result = await database.table('productos').insert(producto);
            return {status:"success",payload:result}
        }catch(error){
            return {status:"error",message:"Error al registrar el producto"+error}
        };
    };

    updateProductById = async (id,body) =>{                              
        try {
            let productoActualizado = await database.update(body).table('productos').where('id', id);
            if(productoActualizado){ 
                return {status:"success",payload:"El producto se ha actualizado"}
            }else{
            return{status:"error",message:"El producto no se ha actualizado"}
            }
        }catch(error){
            return {status:"error", message:"Error al actualizar el producto"+error}
          };
    };

    deleteProductById = async (id) =>{
        try {
            let producto = await database.select().table('productos').where('id',id).first();
            if (producto){
                await database('productos').del().where('id',id);
                return {status:"success",message:"El producto se ha eliminado"}
            }else{
                return {status:"error",message:"No se pudo eliminar el producto"}
            }
        }catch(error){
            return {status:"error", message:"Error al eliminar el producto"+error}
        };
    };
};