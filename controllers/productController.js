import { response } from "express";
import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export function createProduct(req, res) {
  if (!isAdmin(req)) {
    res.json({
      message: "Unauthorized user! Only admin users can create products",
    });

    return;
  }

  const newProductData = req.body;

  const product = new Product(newProductData);

  product
    .save()
    .then(() => {
      res.status(201).json({ message: "Product added successfully" });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Failed to add product", error: err.message });
    });
}

export function getProducts(req, res) {
  Product.find().then((products) => {
    res.json(products);
  });
}
export function deleteProduct(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "Unauthorized user! Only admin users can delete products",
    });
    return;
  }
  const productId = req.params.productId;
  Product.deleteOne({ productId: productId })
    .then(() => {
      res.json({ message: "Product deleted successfully" });
    })
    .catch((err) => {
      res.json({ message: "Failed to delete product", error: err.message });
    });
}

export function updateProduct(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "Unauthorized user! Only admin users can update products",
    });
    return;
  }
  const productId = req.params.productId;
  const updatedProductData = req.body;
  Product.updateOne({ productId: productId }, updatedProductData)
    .then(() => {
      res.json({ message: "Product updated successfully" });
    })
    .catch((err) => {
      res.json({ message: "Failed to update product", error: err.message });
    });
}

export async function getProductById(req, res) {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({ productId: productId });
    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Product not found", error: error.message });
  }
}

export async function searchProducts(req, res) {
  const query = req.params.query;

  try {
    const products = await Product.find({
        $or: [
          { productName: { $regex: query, $options: "i" } },
            
            { altNames: { $regex: query, $options: "i" } },
         
        ],

      
    });

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Product not found", error: error.message });
  }
}
