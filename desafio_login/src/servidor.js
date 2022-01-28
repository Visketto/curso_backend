import express from 'express';
import {engine} from 'express-handlebars';
import session from 'express-session';
//import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import cors from 'cors'; 
import productosRouter from './routes/productos.js';
import carritosRouter from "./routes/carritos.js";
import chatsRouter from './routes/chats.js';
import upload from './services/upload.js';
import __dirname from'./utils.js';
import {Server} from 'socket.io';
import {productosDao} from './daos/index.js';
import {UserModel} from './daos/chats/UsuariosDaoMongoDb.js';
import faker from 'faker';
faker.locale = 'es';
import ChatsService from './services/contenedorChat.js'
const chatsService = new ChatsService()

const admin = true;        //Administrador
const advancedOptions = {useNewUrlParser:true,useUnifiedTopology:true};

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>{
    console.log(`servidor escuchando en el puerto ${PORT}`);
});
export const io = new Server(server);
server.on('error',(error) => console.log('Error en el servidor: '+(error)));

app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    next();
});
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

app.use(session({
    store:MongoStore.create({mongoUrl:"mongodb+srv://Vivi:1234@ecommerce.xfo6x.mongodb.net/ecommerce?retryWrites=true&w=majority"}),
    secret:"1234",
    resave:true,
    saveUninitialized:true,
    mongoOptions:advancedOptions,
    cookie:{maxAge:600000}
}));

//----------------------- Vista de productos ---------------------------//
app.get('/view/productos',(req,res)=>{                   
    productosDao.getAll().then(result=>{
        let info = result.payload;               //PAYLOAD
        let listaProductos ={
            productos : info
        }
        res.render('productos',listaProductos)
    });
});

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

//------------------------- Registro/ Login/ Logout --------------------------------//
app.post('/api/register',upload.single('avatar'),async(req,res) =>{
    try{
        let file = req.file;
        let user = req.body;
        user.age = parseInt(user.age);
        user.avatar = `${req.protocol}://${req.hostname}:${PORT}/images/${file.filename}`; /////
    
        let emailFound = await UserModel.findOne({email:user.email});  ///// Ver.
        if(emailFound){
          alert("El email ya está en uso.")
        }
        await UserModel.create(user);
        res.send({status:'success',message:'Se ha registrado.'})
    }catch(error){
        res.send({status:'error',message:'Error al registrarse.'+error})
    };
});
  
app.post('/api/login',async(req,res) =>{
    try{
        let {email,password} = req.body;
        if (!email||!password){
          throw new Error('Falta completar el email y/o contraseña.')  //////
        };

        let user = await UserModel.findOne({email:email});
        if(!user){
          throw new Error('El email no está registrado.')
        } 
        if(user.password!==password){
          throw new Error('La contraseña es incorrecta.')
        } 

        req.session.user ={
            username:user.username,
            email:user.email
        }
        res.send({status:'success'})
    }catch(error){
      res.status(400).send({status:'error',message:error.message})
    };
});
  
app.get('/api/login',(req,res) =>{
  if(req.session.user){
    res.send(req.session.user)
  }else{
    res.send({status:'error',message:'No ha iniciado sesión.'})
  }
});
  
app.post('/api/logout',(req,res) =>{
  let {username} = req.session.user;
  req.session.user = null;
  res.send({status:'success',payload:{username:username}})
});
  
app.get('/',(req,res) =>{
  res.render('login')
});
  
app.get('/register',(req,res) =>{
  res.render('register')
});
  
app.get('/chat',(req,res) =>{
  res.render('chat')
});
  
app.get('/logout',(req,res) =>{
  res.render('logout')
});

//----------------------- Socket.io -------------------------------//

//Lista de productos                                               
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`);
    let productos = await productosDao.getAll();
    socket.emit('mostrarProductos',productos);
});

//Centro de mensajes
io.on('connection',socket =>{
  chatsService.getChats()
    .then(result =>{
      io.emit('chats',result.payload)
    }).catch(error =>{
      console.error(error)
    })
  socket.on('chats',async data =>{
    chatsService.createChat(data).then(result =>{
      io.emit('chats',result.payload)
      chatsService.getChats()
        .then(result =>{
          io.emit('chats',result.payload)
        }).catch(error =>{
          console.error(error)
        })
    }).catch(error =>{
      console.error(error)
    });
  });
});

//-----------------------------------Error ruta--------------------------------------------//
app.use(function(req,res){
    res.status(404).send({ error : -2, descripcion: 'Ruta no encontrada'});
});
