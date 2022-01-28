import {ChatModel} from "../daos/chats/ChatsDaoMongoDb.js";
import {UserModel} from "../daos/chats/UsuariosDaoMongoDb.js";

export default class ChatsService{
  async getChats(){
    try{
      let result = await ChatModel.find().populate('user')
      return{status:'success',message:'Se ha encontrado la información.',payload:result}
    }catch(error){
      return{status:'error',message:'Error al obtener la información.'+error}
    };
  };

  async createChat(chat){
    try{
      let user = await UserModel.findOne({email:chat.user.email})
      if (!user){
        return{status:'error',message:'Usuario no encontrado.'}
      }

      let chatData ={
        user:user,
        text:chat.message
      }
      let chatCreated = await ChatModel.create(chatData)
      return{status:'success',message:"Se ha creado la información.",payload:chatCreated}
    }catch(error){
      return{status:'error',message:"Error al crear la información."+error}
    };
  };
};
