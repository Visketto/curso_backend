import express from 'express';
import Contenedor from '../classes/Contenedor.js';
import upload from '../services/upload.js';
import {io} from '../servidor.js';
import { authMiddleware } from "../utils.js";
const router = express.Router();
const contenedor = new Contenedor(); 

//GETs
router.get('/',(req,res)=>{
    contenedor.getAll().then(resp =>{
        res.send(resp);
    }).catch(error =>{
        res.send('Error en el servidor: '+(error));
    })   
})

router.get('/:id',(req,res)=>{
    let id = parseInt(req.params.id);
    contenedor.getById(id).then(result=>{
        res.send(result);
    })
})

function getRandom(min,max){                           //No me está funcionando..
    return Math.floor((Math.random()*(max-min))+min);
}
router.get('/productoRandom',(req, res)=>{
    contenedor.getAll().then(resp =>{
        const productoRandom = getRandom(0,(resp.length++));
        res.send(resp[productoRandom]);
    }).catch(error =>{
        res.send('Error en el servidor: '+(error));
    })  
});

//POSTs
router.post('/',authMiddleware,upload.single('image'),(req,res)=>{
    let producto = req.body;
    let file = req.file;
    producto.price = parseInt(producto.price);
    producto.stock = parseInt(producto.stock);                
    producto.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename;
    contenedor.save(producto).then(result=>{
        res.send(result);
        if(result.status==="success"){
            contenedor.getAll().then(result=>{
                io.emit('mostrarProductos',result);
            })
        }
    })
})

//PUTs
router.put('/:id',authMiddleware,(req,res)=>{
    let body = req.body;
    let id = parseInt(req.params.id);
    contenedor.updateProduct(id,body).then(result=>{
        res.send(result);
    })
})

//DELETEs
router.delete('/:id',authMiddleware,(req,res)=>{
    let id= parseInt(req.params.id);
    contenedor.deleteById(id).then(result=>{
        res.send(result)
    })
})

export default router;