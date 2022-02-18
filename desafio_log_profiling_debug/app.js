import express from 'express';
import os from 'os';
import {createLogger} from './logger.js';

const app = express();
const PORT = parseInt(process.argv[2]) || 8080
app.listen(PORT,() => console.log(`Escuchando en el puerto: ${PORT}.`))
const logger = createLogger()

app.use((req,res,next) =>{
  logger.info("info",`${req.method} en ${req.path}.`)
  next()
});

app.get('/',(req,res) =>{
  res.send({status:'success',message:'Bienvenid@'})
});

app.get('/error',(req,res) =>{
  const {username} = req.query;
  if(!username){
    logger.error(`Error: ${req.method} en ${req.path}`)
    res.send({status:'error',message:'Parámetros inválidos.'})
  }else{
    res.send({status:'success',username:username})
  };
});

app.get('/info',(req,res) =>{
  res.send({
    status:'success',
    payload:{
      args: process.argv,
      os: process.platform,
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      execPath: process.execPath,
      processId: process.pid,
      projectFolder: process.cwd(),
      cores: os.cpus().length
    }
  });
});

app.use((req,res) =>{
  logger.warn(`${req.method} en ${req.path}`)
  res.status(404).json({status:'error'})
});