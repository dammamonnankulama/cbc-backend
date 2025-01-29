import express from "express";
import {createProduct,getProducts,deleteProduct, updateProduct, getProductById, searchProducts} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/",createProduct);
productRouter.get("/",getProducts);
productRouter.delete("/:productId",deleteProduct);
productRouter.put("/:productId",updateProduct);
productRouter.get("/:productId",getProductById);
productRouter.get("/search/:query",searchProducts);

export default productRouter;