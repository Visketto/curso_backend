import express from "express";
//import upload from "../services/upload.js";
import Contenedor from '../classes/Contenedor.js';
import Carrito from "../classes/carrito.js";

const contenedor = new Contenedor();
const carrito = new Carrito();
const router = express.Router();

//GETs
router.get('/:cid/productos',(req,res)=>{
    let id = req.params.cid;
    carrito.getCart(id).then(result=>{
        if (result.status === 'Error') {
            res.status(404).send(result.message);
        };
        res.send(result);
    });
});

//POSTs
router.post('/',(req,res)=>{
    carrito.createCart().then(result=>{
        res.send(result);
    });
});

router.post('/:pid/productos/:cid',(req,res)=>{
    let prodId = parseInt(req.params.pid);
    let cartId = req.params.cid;
    carrito.addProd(prodId, cartId).then(result=>{
        res.send(result);
    });
});

//DELETEs
router.delete('/:cid',(req,res)=>{
    let id = req.params.cid;
    carrito.deleteCart(id).then(result=>{
        res.send(result);
    })
})

router.delete('/:cid/productos/:pid',(req,res)=>{
    let prodId = parseInt(req.params.pid);
    let cartId = req.params.cid;
    carrito.deleteProd(cartId, prodId).then(result=>{
        res.send(result);
    });
});

export default router;