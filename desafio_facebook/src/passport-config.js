import passport from 'passport';
import fbStrategy from 'passport-facebook';
import { UserModel } from './daos/chats/UsuariosDaoMongoDb.js';

let FacebookStrategy = fbStrategy.Strategy;
let FACEBOOK_CLIENT_ID = '1063890360844926';
let FACEBOOK_CLIENT_SECRET = '666ed8b00465adaca895b7560dc597d2';

let initializePassportConfig = () =>{
    passport.use('facebook',new FacebookStrategy({
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: 'https://cdae-2800-810-508-8431-f83c-b6fa-736e-6f63.ngrok.io/auth/facebook/callback',
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