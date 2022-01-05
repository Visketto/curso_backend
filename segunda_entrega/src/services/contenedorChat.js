import {database} from "../config.js";

export default class contenedorChat{
    constructor(){
        database.schema.hasTable("chat").then(result =>{
            if(!result){
                database.schema.createTable("chat",table =>{
                    table.increments(),
                    table.timestamps(true, true),
                    table.string("email").notNullable(),
                    table.string("message").notNullable()
                }).then(result =>{
                    console.log("Tabla de chats creada");
                }).catch(error =>{
                    return{status:"error",message:"Error al crear la tabla de chats"+error}
                });
            };
        });
    };

    async getAllMessages(){
        try{
            let chat = await database.select().table("chat");
            return{status:"success",payload:chat}
        }catch(error){
            return{status:"error",message:"Error al obtener los mensajes del chat"+error}
        };
    };

    async saveMessage(message){
        try{
            let chat = await database.select().table("chat");
            if(!chat){
                return{status:"error",message:"Error con el chat"}
            }else{
                await database.select().table("chat").insert(message);
                return{status:"success",payload: message}
            }
        }catch(error){
            return{status:"error",message:"Error al guardar mensaje"+error}
        };
    };

    async deleteMessageById(id){
        try {
            let chat = await database.select().table("chat").where("id",id).first();
            if (chat){
                await database("chat").del().where("id",id);
                return {status:"success",message:"El mensaje de chat se ha eliminado"}
            }else{
                return {status:"error",message:"No se pudo eliminar el mensaje"}
            }
        }catch(error){
            return {status:"error", message:"Error al eliminar el mensaje"+error}
        };
    };
};


