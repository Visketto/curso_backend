import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js";
import Schema from "mongoose";

export default class CarritosDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super('carritos',
            {
                productos:{ 
                    type: [{
                        type:Schema.Types.ObjectId,
                        ref: "productos"
                    }], required: true,
                    default:[], 
                }
            },{timestamps: true}
        )
    }
}