import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Student from './models/student.js';
import studentRouter from './routes/studentRouter.js';
import productsRouter from './routes/productsRouter.js';
import userRouter from './routes/userRouter.js';


const app = express();

//Connect to MongoDB
const mongoUrl ='mongodb+srv://root:root@mongodb.54m6q.mongodb.net/?retryWrites=true&w=majority&appName=MongoDB'

mongoose.connect(mongoUrl,{})

const connection =mongoose.connection;
connection.once('open',()=>{
    console.log("Database Connection succesfully")
})

// use bodyParser
app.use(bodyParser.json())

// use studentRouter
app.use("/api/students",studentRouter)

//use productRouter
app.use("/api/products",productsRouter)

//use userRouter
app.use("/api/users",userRouter)



app.listen(5001,()=>{
    console.log('Server is running on port 5001')
});