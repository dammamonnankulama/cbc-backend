import Order from "../models/order.js";
import { isCustomer } from "./userController";

export async function createOrder(req, res) {

    //take the laest order id and increment it by 1

    if(!isCustomer){
        res.json({ message: "Unauthorized .. Login as a customer to create an order" });

    }

    try {
        const latestOrder = await Order.find().sort({date : -1}).limit(1);

        let OrderId ;
        if(latestOrder.length == 0){
            OrderId = CBC0001;
        }
        else{
            const latestOrderId = latestOrder[0].orderId;
            const orderIdNumber = parseInt(latestOrderId.substring(3));
            OrderId = "CBC" + ("000" + (orderIdNumber + 1)).slice(-4);
        }
         
        const newOrderData = req.body;
        newOrderData.orderId = OrderId;
        newOrderData.email = req.user.email;

        const order = new Order(newOrderData);

        await order.save();
        res.status(201).json({ message: "Order added successfully" });


        
    } catch (error) {
        res.status(500).json({
             message: error.message });
        
    }
}