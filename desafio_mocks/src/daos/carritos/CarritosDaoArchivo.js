import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

export default class CarritosDaoArchivo extends ContenedorArchivo{
    constructor(){
        super('carritos.json');
    }
}