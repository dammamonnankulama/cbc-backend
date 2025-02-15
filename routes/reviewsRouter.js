import express from "express";
import {addReview, hideReview,getReviewsForProduct } from "../controllers/reviewsController.js";
import { isCustomer } from "../controllers/userController.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", addReview)
reviewsRouter.patch("/hide/:reviewId", hideReview);
reviewsRouter.get("/:productId", getReviewsForProduct);


export default reviewsRouter;
