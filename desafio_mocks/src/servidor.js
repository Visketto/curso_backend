import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors'; 
import productosRouter from './routes/productos.js';
import carritosRouter from "./routes/carritos.js";
import chatsRouter from './routes/chats.js'
import upload from './services/upload.js';
import __dirname from'./utils.js';
import {Server} from 'socket.io';
import {productosDao} from './daos/index.js';
import faker from 'faker';
faker.locale = 'es';
import ChatsService from './services/contenedorChat.js'
const chatsService = new ChatsService()

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>{
    console.log(`servidor escuchando en el puerto ${PORT}`);
});
export const io = new Server(server);
server.on('error',(error) => console.log('Error en el servidor: '+(error)));

const admin = true;        //Administrador

app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    next();
})
//app.use(upload.single('file'));
app.use(express.static(__dirname+'/public'));
app.use((req,res,next) =>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log("Petición hecha a las: " + time.toTimeString().split(" ")[0]);
    req.auth = admin;
    next();
  });
app.use('/api/productos',productosRouter);
app.use('/api/carritos',carritosRouter);
app.use('/api/chats',chatsRouter);

//----------------------- Vista de productos ---------------------------//
app.get('/view/productos',(req,res)=>{                   
    productosDao.getAll().then(result=>{
        let info = result.payload;               //PAYLOAD
        let listaProductos ={
            productos : info
        }
        res.render('productos',listaProductos)
    })
})

//------------------------- Faker -------------------------------// (POSTMAN)
app.get('/api/productos-test',(req,res) =>{
    const cantidadProds = 5
    const productos = []
    for (let i = 1; i <= cantidadProds; i++){
        const prod ={
            id:i,
            title:faker.commerce.product(),
            price:faker.commerce.price(2,22,2,'$'),
            thumbnail:`${faker.image.imageUrl()}?${i}`
        };
        productos.push(prod);
    };
    res.json(productos);
});

//------------------------- Subida de imagen -----------------------------//
app.post('/api/uploadfile',upload.fields([
    {name:'file', maxCount:1},
    {name:'documents', maxCount:3}
]),(req,res)=>{
    const files = req.files;
    console.log(files);
    if(!files||files.length===0){
        res.status(500).send({messsage:"No se subió el archivo"})
    }
    res.send(files);
})

//----------------------- Socket.io -------------------------------//

//Lista de productos                                               
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`);
    let productos = await productosDao.getAll();
    socket.emit('mostrarProductos',productos);
})

//Centro de mensajes
io.on('connection',socket =>{
    chatsService.getChats().then(result =>{
        io.emit('chats',result.payload)
        }).catch(error =>{
            console.error(error)
        })
    socket.on('chats',data =>{
        chatsService.getChats().then(result =>{
            io.emit('chats',result.payload)
        }).catch(error =>{
            console.error(error)
        })
    })
})

//-----------------------------------Error ruta--------------------------------------------//
app.use(function(req,res){
    res.status(404).send({ error : -2, descripcion: 'Ruta no encontrada'});
});
