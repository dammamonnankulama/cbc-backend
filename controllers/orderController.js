import Order from "../models/order.js";
import Product from "../models/product.js";
import { isCustomer } from "./userController.js";

export async function createOrder(req, res) {
    // Check if the user is a customer
    if (!isCustomer(req)) {
        return res.status(403).json({
            message: "Please login as a customer to create orders.",
        });
    }

    try {
        // Fetch the latest order for order ID generation
        let orderId;
        let latestOrder = await Order.find().sort({ date: -1 }).limit(1);

        if (latestOrder.length === 0) {
            orderId = "CBC0001";
        } else {
            const currentOrderId = latestOrder[0].orderId;
            const numberString = currentOrderId.replace("CBC", "");
            const number = parseInt(numberString, 10);
            let newNumber = (number + 1).toString().padStart(4, "0");
            orderId = "CBC" + newNumber;
        }

        // Ensure that the orderId doesn't already exist in the database
        let orderExists = await Order.findOne({ orderId });
        while (orderExists) {
            // If the orderId exists, increment the number and check again
            const currentOrderId = orderId.replace("CBC", "");
            const number = parseInt(currentOrderId, 10);
            let newNumber = (number + 1).toString().padStart(4, "0");
            orderId = "CBC" + newNumber;
            orderExists = await Order.findOne({ orderId });
        }


        // Prepare the new order data
        const newOrderData = req.body;



        // new code  07,Dec
        const newProductArray = [];

        /* function that processes an order by validating and transforming the ordered items. 
        It starts by initializing an empty array called newProductArray, */

        for (let i = 0; i < newOrderData.orderedItems.length; i++) {
            const product = await Product.findOne(
                { productId: newOrderData.orderedItems[i].productId })
            if (!product) {
                return res.status(404).json({
                    message: `Product with id ${newOrderData.orderedItems[i].productId} not found.`,
                });
            }
            //code for check the product Stock
            const orderedQuantity = newOrderData.orderedItems[i].quantity;

            if (product.stock < orderedQuantity) {
                return res.status(400).json({
                    message: `Product ${product.productName} is out of stock.`,
                });
            }
            // Update the stock of the product
            product.stock -= orderedQuantity;
            await product.save();

            /*Use push when adding to newProductArray because it ensures a clean and sequential 
            array of products without any gaps.*/
            
            newProductArray.push({
                name: product.productName,
                price: product.price,
                quantity: orderedQuantity,
                image: product.productImages[0],
            });


        }
        console.log(newProductArray)


        newOrderData.orderedItems = newProductArray;

        newOrderData.orderId = orderId;
        newOrderData.email = req.user.email;

        // Save the new order
        const order = new Order(newOrderData);
        await order.save();

        // Respond with success message
        return res.status(201).json({
            message: "Order created successfully.",
            orderId,
        });
    } catch (error) {
        // Catch and respond with any error
        return res.status(500).json({
            message: "Failed to create order.",
            error: error.message,
        });
    }
}

export async function getOrders(req, res) {
    try {
        // Fetch orders associated with the logged-in user's email
        const orders = await Order.find({ email: req.user.email });

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                message: "No orders found for the user.",
            });
        }

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch orders.",
            error: error.message,
        });
    }
}
