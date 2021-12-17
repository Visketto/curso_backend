import { database } from "../config.js";

export default class contenedorChat{
    constructor(){
        database.schema.hasTable("mensajes").then((result) =>{
        if (!result){
            database.schema.createTable("mensajes",(table) =>{
                table.increments();
                table.timestamps(true,true);
                table.string("username").notNullable();
                table.string("message").notNullable();
            })
            .then((result) =>{
                console.log("La tabla de mensajes ha sido creada");
            });
        };
    });
};

    saveMessage = async(msj) =>{
        try{
            const mensaje = await database.table("mensajes").insert(msj);
            console.log(mensaje);
            return{
                status:"success",
                mensaje:"Mensaje registrado",
                payload:mensaje
            };
        }catch(error){
            return{
                status:"Error",
                mensaje:"El mensaje no se pudo registrar"+error
            };
        };
    };

    getAllMessages = async() =>{
        try{
            const mensajes = await database.select().table("mensajes");
            return{status:"success",payload:mensajes};
        }catch(error){
            return {
                status:"Error",
                message:"No se encontraron mensajes"+error
            };
        };
    };
};


