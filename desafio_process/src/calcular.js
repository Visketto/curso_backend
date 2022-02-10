let cantidad = parseInt(process.argv[2]) || 100000000;
let resultado = {};

for(let i=0;i<cantidad;i++){
  let randomNum = Math.ceil(Math.random()*1000);
  resultado[randomNum] = resultado[randomNum]?resultado[randomNum]+1:1;
};

process.send(resultado);