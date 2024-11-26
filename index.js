import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import productsRouter from './routes/productsRouter.js';
import userRouter from './routes/userRouter.js';
import jwt from 'jsonwebtoken';

const app = express();

//Connect to MongoDB
const mongoUrl ='mongodb+srv://root:root@mongodb.54m6q.mongodb.net/?retryWrites=true&w=majority&appName=MongoDB'

mongoose.connect(mongoUrl,{})

const connection =mongoose.connection;
connection.once('open',()=>{
    console.log("Database Connection succesfully")
})

// use bodyParser -middleware
app.use(bodyParser.json())

// creating a middleware for accepting a jwt token and pass through
app.use (
    (req, res, next) => {
        const token = req.header('Authorization')?.replace 
        ("Bearer " ,"")

        if(token != null){
            jwt.verify(token, 'secret-key-5000', (err, decoded) => {
                if(!err){
                    //console.log(decoded)
                    req.user = decoded
                }
                
            })
        }
        next()

        
})



//use productRouter
app.use("/api/products",productsRouter)

//use userRouter
app.use("/api/users",userRouter)



app.listen(5000,()=>{
    console.log('Server is running on port 5000')
});