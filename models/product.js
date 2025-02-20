import mongoose from "mongoose";

const productSchema = mongoose.Schema({

    productId: {
        type: String,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true
    },
    altNames: [
        {
            type: String,
            //required: true
        }
    ],
    productImages: [
        {
            type: String,

        }
    ],
    price: {
        type: Number,
        required: true
    },
    lastPrice: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true, 
        enum: ["makeup", "hair-body", "skin-care"] 
    },
    lowStockAlert: {
        type: Number,
        default: 20
    },
   

})

const Product = mongoose.model("products", productSchema);

export default Product;