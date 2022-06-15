const express = require("express");
const route = express.Router();
const productController = require("../Controllers/product");

route.get("/", productController.get_all_products);
route.post("/addProduct", productController.add_single_product);
route.post("/updateProduct", productController.update_single);
route.get("/:productId", productController.find_single);
route.delete("/:productId", productController.delete_single);

module.exports = route;
