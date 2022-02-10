import __dirname from '../utils.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path:path.resolve(__dirname,'./ecommerce.env')
});

export const MONGO_URL = process.env.MONGO_URL || ''
export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID || ''
export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET || ''
export const FACEBOOK_CALLBACK = process.env.FACEBOOK_CALLBACK || ''

export default{
    fileSystem:{
        baseUrl:__dirname+'/files/'
    },
    mongo:{
        baseUrl: MONGO_URL
    }
};