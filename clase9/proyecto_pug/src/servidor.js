import express from 'express';
import cors from 'cors'; 
import Contenedor from './classes/contenedor.js';
import productosRouter from './routes/productos.js';
import upload from './services/upload.js';

const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`);
});
server.on('error', (error) => console.log('Error en el servidor: '+(error)));
const contenedor = new Contenedor('./files/productos.txt');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    next();
})
//app.use(upload.single('file'));
app.use('/static', express.static('public')); //Virtual Path Prefix
app.use('/api/productos', productosRouter);

app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/view/productos', async(req,res)=>{
    res.render("productos",{data:await contenedor.getAll()});
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
        res.status(500).send({messsage:"No se subió archivo"})
    }
    res.send(files);
})
