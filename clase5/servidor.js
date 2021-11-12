const express = require('express');
const Contenedor = require('./contenedor');

const contenedor = new Contenedor('productos.txt');
const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`);
});

server.on('error', (error) => console.log('Error en el servidor: ' + (error)));


app.get('/', (req, res) => {
    res.send('Desafío servidor con express');
})

app.get('/productos', (req,res)=>{
    contenedor.getAll().then(resp =>{
        res.send(resp);
    }).catch(error =>{
        res.send('Error en el servidor: ' + (error));
    })        
});

function getRandom(min,max){
    return Math.floor((Math.random()*(max-min))+min);
}

app.get('/productoRandom',(req,res)=>{
        contenedor.getAll().then(resp =>{
        const productoRandom = getRandom(0,(resp.length++));
        res.send(resp[productoRandom]);
    }).catch(error =>{
        res.send('Error en el servidor: ' + (error));
    })  
});
