import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js";

export default class ProductosDaoArchivo extends ContenedorArchivo{
    constructor(){
        super('productos.json');
    }
}