import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import reviewsRouter from './routes/reviewsRouter.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173','https://cbc-frontend-eta.vercel.app','https://cbc-frontend-sigma.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    credentials: true // Allow cookies to be sent with requests
}));

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
app.use((req, res, next) => {
    const token = req.header('Authorization')?.replace("Bearer ", "");

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err.message);
            } else {
                console.log("JWT Decoded:", decoded);
                req.user = decoded;
            }
        });
    }
    next();
});



//use productRouter
app.use("/api/products",productRouter)

//use userRouter
app.use("/api/users",userRouter)

//use orderRouter
app.use("/api/orders",orderRouter)

//use reviewsRouter
app.use("/api/reviews",reviewsRouter)



app.listen(5000,()=>{
    console.log('Server is running on port 5000')
});