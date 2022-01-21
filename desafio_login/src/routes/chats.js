import express from 'express';
import ChatsService from '../services/contenedorChat.js';

const chatsService = new ChatsService();
const router = express.Router();

router.get('/',(req,res)=>{
    chatsService.getChats().then(result =>{
        res.send(result)
    });
});

router.post('/',(req,res)=>{
    let chat = req.body;
    chatsService.createChat(chat).then(result =>{
        res.send(result)
    });
});

export default router;