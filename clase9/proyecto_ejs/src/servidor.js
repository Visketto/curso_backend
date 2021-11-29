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

app.set('view engine','ejs');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    next();
})
//app.use(upload.single('file'));
//app.use(express.static('public'));
app.use('/api/productos', productosRouter);

app.get('/',(req, res)=> {
    res.render('pages/index', {titulo:'Ingrese producto'});
});

app.get('/productos',(req, res)=> {
    contenedor.getAll().then(resp =>{
        res.render('pages/productos',{titulo:'Vista de productos', productos:resp});
    }).catch(error =>{
        res.json({error:'Error al pedir productos'});
    })            
});

app.post('/productos', (req,res)=> {
    const producto = {
        title : req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail
   }
    producto.price = parseInt(producto.price);
    contenedor.save(producto).then(resp=>{
        res.redirect('/');
    }).catch(error =>{
        res.json({error:'Error al guardar producto'+error});
    });
});

app.post('/api/uploadfile',upload.fields([
    {
        name:'file', maxCount:1
    },
    {
        name:"documents", maxCount:3
    }
]),(req,res)=>{
    const files = req.files;
    console.log(files);
    if(!files||files.length===0){
        res.status(500).send({messsage:"No se subió el archivo"})
    }
    res.send(files);
})
