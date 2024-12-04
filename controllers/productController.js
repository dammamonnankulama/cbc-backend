import Product from "../models/product.js";

export function createProduct(req, res) {
    const newProductData = req.body;

    const product = new Product(newProductData);

    product
        .save()
        .then(() => {
            res.status(201).json({ message: "Product added successfully" });
        })
        .catch((err) => {
            res.status(400).json({ message: "Failed to add product", error: err.message });
        });
}