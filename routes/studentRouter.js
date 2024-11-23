import express from "express";
import { getStudents,createStudent,updateStudent, deleteStudent } from "../controllers/studentController.js";


const studentRouter = express.Router();

studentRouter.get("/",getStudents );

studentRouter.post("/",createStudent );

studentRouter.delete('/',deleteStudent);


studentRouter.put("/",updateStudent);

export default studentRouter;
