import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors'; 
import Contenedor from './classes/contenedor.js';
import productosRouter from './routes/productos.js';
import carritosRouter from "./routes/carritos.js";
import upload from './services/upload.js';
import __dirname from'./utils.js';
import {Server} from 'socket.io';
import contenedorProductos from './services/contenedorProductos.js';
import contenedorChat from "./services/contenedorChat.js";
//import { authMiddleware } from "./utils.js";

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>{
    console.log(`servidor escuchando en el puerto ${PORT}`);
});
export const io = new Server(server);
server.on('error', (error) => console.log('Error en el servidor: '+(error)));
const contenedor = new Contenedor();
const productosService = new contenedorProductos();
const chatService = new contenedorChat();
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
app.use((req, res, next) => {
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log("Petición hecha a las: " + time.toTimeString().split(" ")[0]);
    req.auth = admin;
    next();
  });
app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritosRouter);

app.get('/view/productos',(req,res)=>{                   
    productosService.getProducts().then(result=>{
        let info = result.payload;
        let listaProductos ={
            productos : info
        }
        res.render('productos',listaProductos)
    })
})
app.get("/api/productRandom", (req, res) =>{
    try {
        contenedor.getRandomProduct().then((result) =>{
        let products = result.payload;
        console.log(products);
        if (result.status === "success") {
            console.log("RESULT", result);
            res.send(result.payload);
        }else{
            res.send(res.message);
        }
      });
    }catch (error){
        res.send(res.message);
    }
});

app.post('/api/uploadfile',upload.fields([
    {
        name:'file', maxCount:1
    },
    {
        name:'documents', maxCount:3
    }
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
    let productos = await productosService.getProducts();
    socket.emit('mostrarProductos',productos);
})

//Centro de mensajes
let chatMensajes = await chatService.getAllMessages();

io.on("connection", (socket) =>{
  socket.emit("mensajes", chatMensajes.payload);
  socket.on("message", async(data) =>{
    chatService.saveMessage(data);
    io.emit("mensajes", chatMensajes.payload);
  });
});

app.post("/api/mensajes",(req,res) =>{
  const mensaje = req.body;
  chatService.saveMessage(mensaje).then((result) =>{
    res.send(result);
  });
});
app.get("/api/mensajes",(req,res) =>{
  chatService.getAllMessages().then((result) =>{
    res.send(result);
  });
});

//Error ruta
app.use(function(req,res){
    res.status(404).send({ error : -2, descripcion: 'Ruta no encontrada'});
});
