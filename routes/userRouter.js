import express from 'express';
import { createUser, loginUser,  getUser, findUsers, googleLogin,toggleBlockUser ,authenticateUser } from "../controllers/userController.js";


const userRouter = express.Router();

userRouter.post("/",createUser);

userRouter.post("/login",loginUser)
userRouter.get("/customers", findUsers);
userRouter.post("/google", googleLogin);
userRouter.get("/", authenticateUser, getUser);
userRouter.put("/block/:userId", authenticateUser, toggleBlockUser);


export default userRouter;