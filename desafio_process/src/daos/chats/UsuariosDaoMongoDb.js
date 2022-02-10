import mongoose from 'mongoose';
const {Schema,model} = mongoose;

export const UserSchema = new Schema({
  firstName:{ type:String, required:true },
  lastName:{ type:String, required:true },
  email:{ type:String, required:true,unique:true },
  username:{ type:String, required:true,unique:true, default:':)' },
  password:{ type:String, required:true },
  age:{ type:Number, required:true },
  avatar:{ type:String, required:true,default:'https://www.iconfinder.com/icons/3561842/emoji_emoticon_expression_shame_smiley_icon' }
},{timestamps:true});
  
UserSchema.set('toJSON',{
  transform:(document,returnedObject) =>{
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
});
  
export const UserModel = model('User',UserSchema);