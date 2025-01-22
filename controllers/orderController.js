import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin, isCustomer } from "./userController.js";

export async function createOrder(req, res) {
  // Check if the user is a customer
  if (!isCustomer(req)) {
    return res.status(403).json({
      message: "Please login as a customer to create orders.",
    });
  }

  try {
    // Fetch the latest orderfor order ID generation
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

    // Initialize an empty array to store the new products
    const newProductArray = [];

    /* function that processes an order by validating and transforming the ordered items. 
        It starts by initializing an empty array called newProductArray, */

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const product = await Product.findOne({
        productId: newOrderData.orderedItems[i].productId,
      });
      if (!product) {
        return res.status(404).json({
          message: `Product with id ${newOrderData.orderedItems[i].productId} not found.`,
        });
      }
      //code for check the product Stock
      const orderedQuantity = newOrderData.orderedItems[i].qty;

      if (product.stock < orderedQuantity) {
        return res.status(400).json({
          message: `Product ${product.productName} is out of stock.`,
        });
      }
      // Update the stock of the product
      product.stock -= orderedQuantity;
      await product.save();

      // // Check if the stock is below the lowStockAlert
      if (product.stock < product.lowStockAlert) {
        // Send an email to the admin
        console.log(
          `Product ${product.productName} is below the low stock alert.`
        );

        /* Use push when adding to newProductArray because it ensures a clean and sequential 
                array of products without any gaps. */
        newProductArray.push({
          name: product.productName,
          price: product.lastPrice,
          qty: orderedQuantity,
          image: product.productImages[0],
        });
      }
    }

    console.log(newProductArray);

    newOrderData.orderedItems = newProductArray;
    newOrderData.orderId = orderId;
    newOrderData.email = req.user.email;

    // Save the new order
    const order = new Order(newOrderData);


    const savedOrder =await order.save();

    // Respond with success message
    return res.status(201).json({
      message: "Order created successfully.",
      orderId,
      order: savedOrder,
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
    });
  }
}
