import passport from 'passport';
import fbStrategy from 'passport-facebook';
import {UserModel} from '../daos/chats/UsuariosDaoMongoDb.js';
import dotenv from 'dotenv';
dotenv.config();

let FacebookStrategy = fbStrategy.Strategy;

let initializePassportConfig = () =>{
    passport.use('facebook',new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK + '/home',
        profileFields: ['id','displayName','photos','emails']
    },async(accessToken,refreshToken,userProfile,done) =>{
        try{
            console.log(userProfile);
            let user = await UserModel.findOne({email: userProfile.emails[0].value});  ////
            if (!user) throw new Error('No se ha encontrado el usuario.');

            let fullName = userProfile.displayName.split(' ');
            await UserModel.findByIdAndUpdate(user._id,{avatar:userProfile.photos[0].value,firstName:fullName[0],lastName:fullName[1]});
            return done(null,user)
        }catch(error){
            return done(error)
        }
    }));

    passport.serializeUser((user,done) =>{
        done(null,user._id)
    });

    passport.deserializeUser((id,done) =>{
        UserModel.findById(id,done)
    });
};

export default initializePassportConfig;