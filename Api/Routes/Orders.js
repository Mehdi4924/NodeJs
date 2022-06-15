const express = require("express");
const route = express.Router();
const orderController = require("../Controllers/order");

route.post("/createOrder", orderController.create_order);
route.get("/:prodId", orderController.all_orders_against_product);

module.exports = route;
