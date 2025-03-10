import express from "express";
import {createProduct,getProducts,deleteProduct, updateProduct, getProductById, searchProducts,getProductsByCategory, getLatestProducts, getBestDiscountProducts } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/",createProduct);
productRouter.get("/",getProducts);
productRouter.delete("/:productId",deleteProduct);
productRouter.put("/:productId",updateProduct);
productRouter.get("/latest", getLatestProducts);
productRouter.get("/:productId",getProductById);
productRouter.get("/search/:query",searchProducts);
productRouter.get("/category/:category", getProductsByCategory);
productRouter.get("/best-discounts", getBestDiscountProducts);


export default productRouter;