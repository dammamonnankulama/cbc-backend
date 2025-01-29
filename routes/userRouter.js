import express from 'express';
import { createUser, loginUser,  getUser, findUsers  } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/",createUser);
userRouter.get("/",getUser)
userRouter.post("/login",loginUser)
userRouter.get("/customers", findUsers);


export default userRouter;