import express from 'express';
import { createOrder, getOrders, getQuote, getTrendingProducts, updateOrder } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/", createOrder)
orderRouter.get("/trending", getTrendingProducts);
orderRouter.get("/", getOrders) 


orderRouter.post("/quote", getQuote)
orderRouter.put("/:orderId", updateOrder)

export default orderRouter;