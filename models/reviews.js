import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
    {
        reviewId: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            ref: "User", // Refers to the 'User' collection
            required: true
        },
        productId: {
            type: String,
            ref: 'Product',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        hidden: {
          type: Boolean,
          default: false,  // Set default to false, meaning the review is not hidden initially
        },
    },
   
);

const Review = mongoose.model("reviews", reviewSchema);

export default Review;