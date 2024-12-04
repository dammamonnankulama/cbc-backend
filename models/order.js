import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    
        orderId: {
            type: String,
            required: true,
            unique: true
        },
        email : {
            type : String,
            required : true
        },

        orderDate: {
            type: Date,
            default: Date.now
        },
        orderStatus: {
            type: String,
            default: "Pending"
        },
        orderItems: [
            {
                productId: {
                    type: String,
                    required: true
                },
                productName: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                image: {
                    type: String,
                    required: true
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true
        },

        paymentId: {
            type: String,
            
        },
        notes: {
            type: String,
            
        },
        name: {
            type: String,
            required: true

            
        },
        address: {
            type: String,
            required: true

            
        },
        phoneumber: {
            type: String,
            required: true

            
        }


})

const Order = mongoose.model("orders", orderSchema);

export default Order;