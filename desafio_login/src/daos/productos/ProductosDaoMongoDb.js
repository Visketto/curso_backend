import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js";

export default class ProductosDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super('productos',
            {
                title: { type: String, required: true },
                description: {type: String, required: true},
                code: {type: String, required: true},
                thumbnail: { type: String, required: true },
                price: { type: Number, required: true },
                stock: {type: Number, required: true}
            },{timestamps: true}
        )
    }
}