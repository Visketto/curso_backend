const express = require('express');
const cors = require('cors');
const multer = require('multer');

const Contenedor = require('./classes/contenedor');

const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`servidor escuchando en el puerto ${PORT}`);
});
server.on('error', (error) => console.log('Error en el servidor: '+(error)));

const contenedor = new Contenedor('./files/productos.txt');
const productosRouter = require('./routes/productos');

const storage = multer.diskStorage({  
    destination:function(req,file,cb){ 
        cb(null,'public')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname);  
    }                                          
})
const upload = multer({storage:storage});

app.use(upload.single('file'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//app.use('/imagenes',express.static(__dirname+'public'));
app.use(cors());

app.use('/api/productos', productosRouter);

app.get('/', (req, res) => {
    res.send('Desafío API RESTful');
})

/*app.post('/api/uploadfile',upload.single('file'),(req,res)=>{  
    const file = req.file;
    if(!file||file.length===0){
        res.status(500).send({message:"No se subió el archivo."})
    }
    res.send(file);
})*/
