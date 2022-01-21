import {ChatModel} from "../daos/chats/ChatsDaoMongoDb.js";
import {AuthorModel} from "../daos/chats/AutorDaoMongoDb.js";
import {normalize,schema} from "normalizr";

export default class ChatsService{
    async getChats(){
        try{
            let result = await ChatModel.find().populate("author")
            let originalData = {"id":"messages","chats":JSON.parse(JSON.stringify(result))}

            let author = new schema.Entity("author")
            let chat = new schema.Entity("chat",{
                author:author
            })
            let messages = new schema.Entity("messages",{
                chats:[chat]
            })
            let normalizedData = normalize(originalData,messages)

            return {status:"success",message:"Se ha encontrado la información.",payload:result}
            }catch(error){
            return {status:"error",message:"Error al obtener la información."+error}
        };
    };

    async createChat(chat){
        try{
            let authorData ={
                id:chat.id,
                firstName:chat.firstName,
                lastName:chat.lastName,
                age:parseInt(chat.age),
                alias:chat.alias,
                avatar:chat.avatar
            }
            let authorCreated = await AuthorModel.create(authorData)

            let chatData ={
                author:authorCreated,
                message:chat.message
            }
            let chatCreated = await ChatModel.create(chatData)

            return {status:"success",message:"Se ha creado la información.",payload:chatCreated}
            }catch(error){
            return {status:"error",message:"Error al crear la información."+error}
        };
    };
};
