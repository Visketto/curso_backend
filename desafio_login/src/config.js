import knex from 'knex';
import __dirname from './utils.js';

export default{
    fileSystem:{
        baseUrl:__dirname+'/files/'
    },
    mongo:{
        baseUrl: "mongodb+srv://Vivi:1234@ecommerce.xfo6x.mongodb.net/ecommerce?retryWrites=true&w=majority"
    },
    firebase:{
        "type": "service_account",
        "project_id": "ecommerce-f8836",
        "private_key_id": "938d5898741f42bab81f16c78f5b9170fcbd82e6",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQDWdJDGuW7HhxIz\nDh3WryJFfAlGC+gCImBeYDZ0rc+Fe9a4aPGF5SY6m8i0kPnB5dHMe0BFwzmXs+dI\nOO57aVZiUaZwqx0pfsgMHlFCioGTB0rtPoocAQ5htbYdOxMMCXy0iiD193dzwDjc\nXHSPlDS//KwLxtVaaJtsH0oDw54DvnDyV9qKkLzSwCl2bCUwdLGBaqA5/PdPgpwB\nXnTjLVr6lT02qnyWZkIaAjivdEz22BuKZRLnbC32ABipFqP+mIfdjiOGWSnMqFIJ\nr4knyLDeN9DEJFxGa9nto0962p+eZZvaCG7mpVJiwVRj7sjOrfp0hL/Sg6eGNCvx\nlyWSaIB1AgMBAAECggEAA4wj5/Ghzub3AAVerNIyptkYKIKNE4Sg46FuTSxMh5NR\nQuAo3J46LWktyaowmMqV15l9/5ls3rZLtV1huS9jIyxhbIbcFuIMFO08dWASqCK2\n/ykpbNtUnaen6/Wx8+FFS5GRstflhTKRDjjGTH4MXapO6Jag/rDxHzmo8QUqRuVh\nZZ8IMWax20gFtfMPPkcmwwy7r2+oBzUbttqICfV+jf7tuMA6DGgT4E2jo/wgKTfT\npXdX6l/Qh8JN0nurkKXvpDWP+PPzVgcMhN+NHX6N0nxLiohjeB657WdSkTKRzvnf\nIP2PjoCDFATSqrb5Otx98OksGvKRs01knhT1m1DXiQKBgQDq4bMhhWN+ikZTm+x5\nNLmESnj5aEvWjKzAxHZrHsQi2YSwao63vQw36D1iqNLz9IXk+jt0HT/SngeLu1R5\nI9xp20eD78SG+rm/Whkz5RMBzPplzHQNwOlN78q1amtz25CAJQT7j5eJJMjYHlqi\n+6ZGIG3nYcCMZ1s/X590ooMJDQKBgQDpvLYBUNkddvdE6DC2+5Q0EwgRto2Tt3zo\nVU8Z4ue16umxODIr2up5P+oKwVFv/cc8JElUtQX8eZn+s79clgQ/+rXiFDAqyQZk\nk9LeDlgYkzqyJYl15YPz2D17TTqRgj5sZw+PvcKnVBLPny6UVudSE3oe4a01PqpY\nCplx3GgrCQKBgDmuH21V8m76yfZyTgod1okUOM0Wvbj8ZtgX5vS7Y3Mjc6BXKqEY\nfc2k7J4z00oxfEgU41DKdgfk4vl/kWkGU3RzcwaFdP+oxsClAZdq49YHXl5tbPqL\nqz+GaYNPlP+opb2yWZzlUFNPgzr/iUaJAfYqtJKjwMM6BoBznRbpacBpAn9IIPQJ\nc+mMLiogGYbu8LPLXhQfYzZNX1IsYCcI1fyrJtL23WCeJ/AzeoW+y+lVpfrVlF0M\nxtASGXRsJQvohmLJW5TFL3Wtvls6rmNkIwkMjGKQlwTUXP9bQF+4rRxlyst4qFUl\nBmoLOOaVK4o0PJ0lttz4qqvIwo3OnXa8rEd5AoGAP4YqXS6DbasD6+iIoGIBc8Se\n+bNJ54+eqzTGqepgUvGt5BGqs2JFgtIBY6YSV+KTf33IUhh+GR4pmELH7JcQx1e1\nG6yPWR7xKnKLgs7URlnBuY9aDWRHBe2VdBTiGnx3J58rUYGgGoligxk9Zx7NDKPx\nM+mKCNtrZsnvmv3NAIo=\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-djhes@ecommerce-f8836.iam.gserviceaccount.com",
        "client_id": "108079192171454049515",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-djhes%40ecommerce-f8836.iam.gserviceaccount.com"
    }
};

//
export const database = knex({
    client:'sqlite3',
    connection:{filename:__dirname+'/db/ecommerce.sqlite'}
});