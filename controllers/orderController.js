import Order from "../models/order.js";
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
        const latestOrder = await Order.find().sort({ date: -1 }).limit(1);

        let orderId;
        if (latestOrder.length === 0) {
            orderId = "CBC0001";
        } else {
            const currentOrderId = latestOrder[0].orderId;
            const numberString = currentOrderId.replace("CBC", "");
            const number = parseInt(numberString, 10);
            const newNumber = (number + 1).toString().padStart(4, "0");
            orderId = "CBC" + newNumber;
        }

        // Prepare the new order data
        const newOrderData = req.body;
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
