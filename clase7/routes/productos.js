const express = require('express');
const router = express.Router();
const Contenedor = require('../classes/contenedor');
const contenedor = new Contenedor();

//GETs
router.get('/',(req,res)=>{
    contenedor.getAll().then(resp =>{
        res.send(resp);
    }).catch(error =>{
        res.send('Error en el servidor: '+(error));
    })   
})

router.get('/:id',(req,res)=>{             //No me está funcionando..
    let id = parseInt(req.params.id);
    let producto = contenedor.getById(id);
    if (producto.status === 'success') {
        res.send(producto);
    }else{
        res.send('No se encuentra el producto.')
    }
});

function getRandom(min,max){               //No me está funcionando..
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
router.post('/',(req,res)=>{
    let producto = req.body;
    console.log(producto);
    contenedor.save(producto).then(result=>{
        res.send(result);
    })
})

//PUTs
router.put('/:id',(req,res)=>{
    let body = req.body;
    let id = parseInt(req.params.id);
    contenedor.updateProduct(id,body).then(result=>{
        res.send(result);
    })
})

//DELETEs
router.delete('/:id',(req,res)=>{
    let id= parseInt(req.params.id);
    contenedor.deleteById(id).then(result=>{
        res.send(result)
    })
})

module.exports = router;