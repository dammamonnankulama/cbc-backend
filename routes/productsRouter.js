import express, { request } from "express";  
import { getProduct,createProduct,deleteProduct,getProductByName } from "../controllers/productController.js";

const productsRouter =express.Router();

productsRouter.get('/',getProduct);

productsRouter.get('/:name',getProductByName);

productsRouter.post('/',createProduct);

productsRouter.delete('/',deleteProduct);



export default productsRouter;