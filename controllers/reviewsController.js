import Review from "../models/reviews.js";
import Order from "../models/order.js"; 
import Product from "../models/product.js";
import { isCustomer } from "./userController.js";
import { nanoid } from "nanoid";


export async function addReview(req, res) {
  try {
      const userEmail = req.user.email;
      const { productId, rating, comment } = req.body;

      // Validate input
      if (!rating || rating < 1 || rating > 5) {
          return res.status(400).json({ message: "Rating must be between 1 and 5." });
      }
      if (!comment || comment.trim().length === 0) {
          return res.status(400).json({ message: "Comment is required." });
      }

      // Check if user is a customer
      if (!(await isCustomer(req, res))) {
          return res.status(403).json({ message: "Only customers can add reviews." });
      }

      // Check if the product exists
      const product = await Product.findOne({ productId });
      if (!product) {
          return res.status(404).json({ message: "Product not found." });
      }

      // Check if user purchased the product
      const orders = await Order.find({ email: userEmail });
      const hasPurchased = orders.some(order =>
          order.orderedItems.some(item => item.productId === productId)
      );
      if (!hasPurchased) {
          return res.status(403).json({ message: "You can only review products you have purchased." });
      }

      // Check if the user has already reviewed the product
      if (await Review.findOne({ productId, email: userEmail })) {
          return res.status(400).json({ message: "You have already reviewed this product." });
      }

      // Generate a unique review ID using nanoid
      const reviewId = `REV${nanoid(8)}`; // Example: REV-aBc123Xy

      // Create and save the review
      const newReview = new Review({
          reviewId,
          email: userEmail,
          productId,
          rating,
          comment,
          createdAt: new Date(),
          hidden: false
      });

      await newReview.save();
      res.status(201).json({ message: "Review added successfully", review: newReview });

  } catch (error) {
      console.error("Error in addReview:", error);
      res.status(500).json({ message: "Failed to add review.", error: error.message });
  }
}
  

  // Function to get reviews for a product
  export async function getReviewsForProduct(req, res) {
    const { productId } = req.params;
    try {
      const reviews = await Review.find({ productId });
      if (reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for this product." });
      }
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews.", error: error.message });
    }
  }
  export async function hideReview(req, res) {
    try {
      const { reviewId } = req.params;
      
      // Find the review and hide it (set hidden to true)
      const review = await Review.findOne({ reviewId });
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      review.hidden = true;
      await review.save();
  
      res.status(200).json({ message: "Review hidden successfully", review });
    } catch (error) {
      res.status(500).json({ message: "Failed to hide review", error: error.message });
    }
  }
