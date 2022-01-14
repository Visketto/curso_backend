import mongoose from 'mongoose';
const {Schema,model} = mongoose;

export const AuthorSchema = new Schema({
    id:{type:String,required:true},
    firstName:{type:String,required:true},
    lastName:{type: String, required: true},
    age:{type:Number,required:true},
    alias:{type:String,required:true},
    avatar:{type:String,required:true}
},{timestamps:true})

export const AuthorModel = model('Author',AuthorSchema);
