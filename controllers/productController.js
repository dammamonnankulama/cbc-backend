import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export function createProduct(req, res) {

    if (!isAdmin(req)) {
        res.json({ message: "Unauthorized user! Only admin users can create products" });


        return

    }


    const newProductData = req.body;

    const product = new Product(newProductData);

    product
        .save()
        .then(() => {
            res.status(201).json
            ({ message: "Product added successfully" });
        })
        .catch((err) => {
            res.status(400).json
            ({ message: "Failed to add product", error: err.message });
        });
}

export function getProducts(req, res) {
    Product.find().then(
        products => {
            res.json(products);
        }
    )
}