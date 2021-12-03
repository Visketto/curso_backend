import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors'; 
import Contenedor from './classes/contenedor.js';
import productosRouter from './routes/productos.js';
import upload from './services/upload.js';
import __dirname from'./utils.js';
import {Server} from 'socket.io';

const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`);
});
export const io = new Server(server);
server.on('error', (error) => console.log('Error en el servidor: '+(error)));
const contenedor = new Contenedor();

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
app.use('/api/productos', productosRouter);

app.get('/view/productos',(req,res)=>{
    contenedor.getAll().then(result=>{
        let info = result;
        let listaProductos ={
            productos : info
        }
        res.render('productos',listaProductos)
    })
})

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
        res.status(500).send({messsage:"No se subió archivo"})
    }
    res.send(files);
})

//----------------------- Socket.io -------------------------------

//Lista de productos
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`);
    let productos = await contenedor.getAll();
    socket.emit('mostrarProductos',productos);
})

//Centro de mensajes
let mensajes=[];

let fecha = new Date()
let año=fecha.getFullYear();
let mes=fecha.getMonth()+1;
let dia=fecha.getDate();
let hora=fecha.getHours();
let min=fecha.getMinutes();
let sec=fecha.getSeconds();
let fechaEnvio= dia+'/'+mes+'/'+año+' Hora: '+hora+':'+min+':'+sec+'hs'

io.on('connection',socket=>{
    socket.emit("messagelog",mensajes);
    socket.on('message',data=>{
        mensajes.push({id:socket.id,time:fechaEnvio,message:data})
        io.emit('messagelog',mensajes)
    });
});
