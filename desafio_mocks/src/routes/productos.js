import express from 'express';
import upload from '../services/upload.js';
import {io} from '../servidor.js';
import {productosDao,persistence} from '../daos/index.js';
import {authMiddleware} from "../utils.js";
//import contenedorProductos from '../services/contenedorProductos.js'; 

const router = express.Router();
//const productosService = new contenedorProductos(); 

//--------------------------- GETs --------------------------------//
router.get('/',(req,res)=>{                           
    productosDao.getAll().then(result =>{
        res.send(result);
    }).catch(error =>{
        res.send('Error en el servidor: '+(error));
    })   
})

router.get('/:pid',(req,res)=>{                        
    let id = req.params.pid;
    if (persistence=='fileSystem'){
        id= parseInt(id);
    }    
    productosDao.getById(id).then(result=>{
        res.send(result);
    })
})

//--------------------------- POSTs --------------------------------//
router.post('/',authMiddleware,upload.single('image'),(req,res)=>{      
    let producto = req.body;
    let file = req.file;
    producto.price = parseInt(producto.price);
    producto.stock = parseInt(producto.stock);                
    producto.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename; //.filename             

    productosDao.save(producto).then(result=>{
        res.send(result);
        if(result.status==="success"){
            productosDao.getAll().then(result=>{
                io.emit('mostrarProductos',result);
            })
        }
    })
})

//--------------------------- PUTs --------------------------------//
router.put('/:pid',authMiddleware,(req,res)=>{                           
    let body = req.body;
    let id = req.params.pid;
    if (persistence=='fileSystem'){
        id= parseInt(id);
    } 
    productosDao.updateById(id,body).then(result=>{
        res.send(result);
    })
})

//--------------------------- DELETEs --------------------------------//
router.delete('/:pid',authMiddleware,(req,res)=>{                               
    let id = req.params.pid;
    if (persistence=='fileSystem'){
        id= parseInt(id);
    }      
    productosDao.deleteById(id).then(result=>{
        res.send(result)
    })
})

router.delete('/',authMiddleware,(req,res)=>{                      
    productosDao.deleteAll().then(result=>{
        res.send(result)
    })
})

export default router;