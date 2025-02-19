import express from "express";
import {addReview,getReviewsForProduct, deleteReview } from "../controllers/reviewsController.js";
import { isCustomer } from "../controllers/userController.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", addReview)
reviewsRouter.delete("/delete/:reviewId", deleteReview);
reviewsRouter.get("/:productId", getReviewsForProduct);


export default reviewsRouter;
