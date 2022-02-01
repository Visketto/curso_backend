import express from "express";
//import upload from "../services/upload.js";
import {carritosDao,persistence} from '../daos/index.js';

const router = express.Router();

//--------------------------- GETs --------------------------------//
router.get('/',(req,res)=>{                          
    carritosDao.getAll().then(result =>{
        res.send(result);
    }).catch(error =>{
        res.send('Error en el servidor: '+(error));
    })   
})

router.get('/:cid/productos',(req,res)=>{             
    let id = req.params.cid;
    carritosDao.getById(id).then(result=>{
        if(result.status === 'Error'){
            res.status(404).send(result.message);
        };
        res.send(result);
    });
});

//--------------------------- POSTs --------------------------------//
router.post('/',(req,res)=>{                          
    carritosDao.createCart().then(result=>{
        res.send(result);
    });
});

router.post('/:cid/productos/:pid',(req,res)=>{       
    let prodId = req.params.pid;
    let cartId = req.params.cid;
    if (persistence=='fileSystem'){
        prodId= parseInt(prodId);
    } 
    carritosDao.addProd(prodId, cartId).then(result=>{
        res.send(result);
    });
});

/*//MongoDB
router.post('/productoAgregado',(req,res)=>{
    const cartId = req.body.cid;
    const productId = req.body.pid;
    carritosDao.addProd(cartId, productId).then(result =>{
      if (result.status === 'success') res.status(200).json(result)
      else res.status(500).send(result)
    })
})*/

//--------------------------- DELETEs --------------------------------//
router.delete('/:cid',(req,res)=>{                    
    let id = req.params.cid;
    carritosDao.deleteById(id).then(result=>{
        res.send(result);
    })
})

router.delete('/:cid/productos/:pid',(req,res)=>{
    let prodId = req.params.pid;
    let cartId = req.params.cid;
    if (persistence=='fileSystem'){
        prodId= parseInt(prodId);
    } 
    carritosDao.deleteProd(cartId, prodId).then(result=>{
        res.send(result);
    });
});

export default router;