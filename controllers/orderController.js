import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin, isCustomer } from "./userController.js";

export async function createOrder(req, res) {
  if (!isCustomer(req)) {
    return res.status(403).json({
      message: "Please login as a customer to create orders.",
    });
  }

  try {
    // Generate a unique orderId
    let latestOrder = await Order.find().sort({ date: -1 }).limit(1);
    let orderId = latestOrder.length === 0 ? "CBC0001" : generateOrderId(latestOrder[0].orderId);

    // Validate and process ordered items
    const newOrderData = req.body;
    const newProductArray = [];

    for (let item of newOrderData.orderedItems) {
      const product = await Product.findOne({ productId: item.productId });

      if (!product) {
        return res.status(404).json({
          message: `Product with ID ${item.productId} not found.`,
        });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          message: `Product ${product.productName} is out of stock.`,
        });
      }

      // Update product stock
      product.stock -= item.qty;
      await product.save();

      // Add validated product to the array
      newProductArray.push({
        name: product.productName,
        price: product.lastPrice,
        qty: item.qty,
        image: product.productImages[0],
      });

      // Trigger low stock alert if needed
      if (product.stock < product.lowStockAlert) {
        console.log(`Product ${product.productName} is below the low stock alert.`);
      }
    }

    // Update the order data
    newOrderData.orderedItems = newProductArray;
    newOrderData.orderId = orderId;
    newOrderData.email = req.user.email;

    // Save the order
    const order = new Order(newOrderData);
    const savedOrder = await order.save();

    return res.status(201).json({
      message: "Order created successfully.",
      orderId,
      order: savedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create order.",
      error: error.message,
    });
  }
}

// Helper function to generate unique orderId
function generateOrderId(currentOrderId) {
  const numberString = currentOrderId.replace("CBC", "");
  const number = parseInt(numberString, 10) + 1;
  return "CBC" + number.toString().padStart(4, "0");
}

export async function getOrders(req, res) {
  
  try {
   
   if (isCustomer(req)) {
      // Fetch orders associated with the logged-in user's email
    const orders = await Order.find({ email: req.user.email });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ 
        message: "No orders found for the user.",
      });
    }

    return res.status(200).json(orders);
    }
    else if(isAdmin(req))
      {
        const orders = await Order.find();

        if (!orders || orders.length === 0) {
          return res.status(404).json({ 
            message: "No orders found.",
          });
        }
    
        return res.status(200).json(orders);

    }
    else{
      return res.status(403).json({
        message: "Please login as a customer or admin to view orders.",
      });
    }
    
    
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch orders.",
      error: error.message,
    });
  }
}

export async function getQuote(req, res) {
  try {
    const newOrderData = req.body;

    const newProductArray = [];

    let totalPrice = 0;
    let labeledTotalPrice = 0;

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const product = await Product.findOne({
        productId: newOrderData.orderedItems[i].productId,
      });
      if (!product) {
        return res.status(404).json({
          message: `Product with id ${newOrderData.orderedItems[i].productId} not found.`,
        });
      }

      labeledTotalPrice += product.price * newOrderData.orderedItems[i].qty;
      totalPrice += product.lastPrice * newOrderData.orderedItems[i].qty;

      newProductArray.push({
        name: product.productName,
        price: product.lastPrice,
        labeledPrice: product.price,
        qty: newOrderData.orderedItems[i].qty,
        image: product.productImages[0],
      });
    }

    console.log(newProductArray);

    newOrderData.orderedItems = newProductArray;
    newOrderData.totalPrice = totalPrice;

    res.json({
      orderedItems: newProductArray,
      totalPrice,
      labeledTotalPrice,
    });
  } catch (error) {
    // Catch and respond with any error
    return res.status(500).json({
      message: "Failed to create order.",
      error: error.message,
      //testing branch
    });
  }
}
export async function updateOrder(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({
      message: "Please login as an admin to update orders.",
    });
  }

  try {
    const orderId = req.params.orderId;
    const updatedData = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        message: `Order with ID ${orderId} not found.`,
      });
    }

    if (updatedData.status) {
      order.status = updatedData.status;
    }

    if (updatedData.notes) {
      order.notes = updatedData.notes;
    }

    const updatedOrder = await order.save();

    return res.status(200).json({
      message: "Order updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update order.",
      error: error.message,
    });
  }

}