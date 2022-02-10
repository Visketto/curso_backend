import express from 'express';
import {engine} from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import {MONGO_URL} from './config/config.js';
import cors from 'cors'; 
import productosRouter from './routes/productos.js';
import carritosRouter from './routes/carritos.js';
import chatsRouter from './routes/chats.js';
import upload from './services/upload.js';
import __dirname from'./utils.js';
import {Server} from 'socket.io';
import {productosDao} from './daos/index.js';
import {UserModel} from './daos/chats/UsuariosDaoMongoDb.js';
import passport from 'passport';
import initializePassportConfig from './config/passport-config.js';
import minimist from 'minimist';
import {fork} from 'child_process';
import ChatsService from './services/contenedorChat.js';
const chatsService = new ChatsService();

const minimizedArgs = minimist(process.argv);
const PORT = minimizedArgs.port || 8080;

const admin = true;        //Administrador
const advancedOptions = {useNewUrlParser:true,useUnifiedTopology:true};

const app = express();
const server = app.listen(PORT, () =>{
    console.log(`servidor escuchando en el puerto ${PORT}`);
});
export const io = new Server(server);
server.on('error',(error) => console.log('Error en el servidor: '+(error)));

app.engine('handlebars',engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0],req.method,req.url);
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
    store:MongoStore.create({mongoUrl:MONGO_URL}),
    secret:"1234",
    resave:true,
    saveUninitialized:true,
    mongoOptions:advancedOptions,
    cookie:{maxAge:600000}
}));

initializePassportConfig();
app.use(passport.initialize());
app.use(passport.session());

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
});

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
  
app.get('/api/login',(req,res) =>{  //////
  if(req.user){
    res.send(req.user)
  }
  else if(req.session.user)
    res.send(req.session.user)
  else
    res.send({status:'error',message:'No has iniciado sesión.'})
});
  
app.post('/api/logout',(req,res) =>{   ///////
  req.session.destroy()
  req.logout()
  res.send({status:'success',message:'Se ha cerrado la sesión con éxito.'})
});

app.get('/auth/facebook',passport.authenticate('facebook',{scope:['email']}),(req,res) =>{   /////
  console.log('Logueando con el Facebook.');
});

app.get('/auth/facebook/callback',passport.authenticate('facebook',{
  failureRedirect:'/fail',
  successRedirect: '/home'
}),(req,res)=>{
  res.send({message:'logueado'})    
});
  
app.get('/fail',(req, res) =>{
  res.send({status:'error',message:'Ha fallado el inicio de sesión en Facebook.'})
});

app.get('/',(req,res) =>{
  res.render('login')
});

app.get('/register',(req,res) =>{
  res.render('register')
});

app.get('/home',(req,res) =>{
  res.render('home')
});

app.get('/chat',(req,res) =>{
  res.render('chat')
});
  
app.get('/logout',(req,res) =>{
  res.render('logout')
});

app.get('/info',(req,res) =>{
  res.send({
    status:'success',
    payload:{
      args:process.argv,
      os:process.platform,
      nodeVersion:process.version,
      memoryUsage:process.memoryUsage(),
      execPath:process.execPath,
      processId:process.pid,
      projectFolder:process.cwd()
    }
  });
});

app.get('/api/randoms',async(req,res) =>{
  let calculate = fork('calcular',[req.query.cant])
  calculate.on('message',(data) =>{
    res.send({numeros:data})
  })
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