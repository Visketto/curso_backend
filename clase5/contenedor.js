const fs = require('fs');


class Contenedor{

    constructor (nombre){
        this.nombre = nombre;
    }
    
    async save(producto){
        try{
            let data = await fs.promises.readFile(`${this.nombre}`, 'utf-8');
            let productos = JSON.parse(data);

            if(productos.some(prod=>prod.title===producto.title)){
                return {status:"error",message:'El producto ya existe.'}
            }else{

                let dataProd = {
                    id: productos.length+1,
                    title:producto.title,
                    price:producto.price,
                    thumbnail:producto.thumbnail,
                }
                productos.push(dataProd);

                try{
                    await fs.promises.writeFile(`${this.nombre}`, JSON.stringify(productos,null,2));
                    return {status:'success', message:'Producto creado.'}
                }catch(err){
                    return{status:'error', message:'No se pudo crear el producto.'}
                }
            }
        }catch{
            
            let dataProd = {
                id: 1,
                title:producto.title,
                price:producto.price,
                thumbnail:producto.thumbnail
            }

            try{
                await fs.promises.writeFile(`${this.nombre}`, JSON.stringify([dataProd],null,2));
                return {status:"success", message:"Producto creado."}
            }catch(error){
                return {status:"error",message:"No se pudo crear el producto:" + error}
            }
        }
    }

    async getById(id){
        try{
            let data = await fs.promises.readFile(`${this.nombre}`, 'utf-8');
            let productos = JSON.parse(data);
            let producto = productos.find(prod => prod.id == id);

            if(producto){
                return {status:"success", producto:producto, message:'Se encontró el producto.'}
            }else{
                return {status:'error',producto:null, message:'No se encontró el producto.'}
            }
        }catch(err){
            return {status:'error',message:'No se encontró el producto.'}
        }
    }

    async getAll(){
        try{
            let data = await fs.promises.readFile(this.nombre,'utf-8');
            let obj = JSON.parse(data);
            let productos = [];

            obj.map((p)=>{
                productos.push(p);
            });     
            return productos;
        }catch(err){
            return {status:'error',message:'Nada por acá.'}
        }
    }

    async deleteById(id){
        try{
            let data = await fs.promises.readFile(`${this.nombre}`, 'utf-8');
            let productos = JSON.parse(data);
            let productoFiltrado = productos.findIndex(prod => prod.id === id);

            if((productoFiltrado != -1 )){
                productos.splice(productoFiltrado,1);
        }else{
            return {status:'error', message:'No existe el ID.'}
            }
            try{
                await fs.promises.writeFile(`${this.nombre}`, JSON.stringify(productos,null,2));
                return {status:"success", message:"Producto eliminado con exito."}
            }catch(error){
                return {status:"error",message:"No se pudo eliminar el producto." + error}
            }  
        }catch(err){
            return {status:'error',message:'No se encontró el id.'}
        } 
    }

    async deleteAll(){
        try{
            let data = await fs.promises.readFile(`${this.nombre}`, 'utf-8');
            let productos = JSON.parse(data);
            productos = [];

            try{
                await fs.promises.writeFile(`${this.nombre}`, JSON.stringify(productos,null,2));
                return {status:"success", message:"Todos los productos han sido eliminados."}
            }catch(error){
                return {status:"error",message:"No se pudieron eliminar los productos:" + error}
            }  
        }catch(err){
            return {status:'error',message:'Error al leer.'}
        } 
    }
}



const contenedorProd = new Contenedor('productos.txt');

contenedorProd.save({title: 'Escuadra', price: 123.45, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png'}).then(result=>{
    console.log(result.message);
})

contenedorProd.save({title: 'Calculadora', price: 234.56, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png'}).then(result=>{
    console.log(result.message);
})

contenedorProd.save({title: 'Globo Terráqueo', price: 345, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png'}).then(result=>{
    console.log(result.message);
})

/*contenedorProd.getById().then(result=>{
    console.log(result.producto, result.message);
})*/

contenedorProd.getAll().then(result=>{
     console.log(result.producto,result.message)
});

/*contenedorProd.deleteById().then(result=>{
   console.log(result.message);
});*/

/*contenedorProd.deleteAll().then(result=>{
    console.log(result.message);
});*/

module.exports = Contenedor;