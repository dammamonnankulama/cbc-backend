import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

//Connect to MongoDB
const mongoUrl = process.env.MONGO_DB_URL

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
            jwt.verify(token, (process.env.SECRET_KEY), (err, decoded) => {
                if(!err){
                    console.log(decoded)
                    //req.user = decoded
                }
                
            })
        }
        next()

        
})



//use productRouter
app.use("/api/products",productRouter)

//use userRouter
app.use("/api/users",userRouter)

//use orderRouter
app.use("/api/orders",orderRouter)



app.listen(5000,()=>{
    console.log('Server is running on port 5000')
});