const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/orders");
const Product = require("../models/product");

route.post("/createOrder", (req, res, next) => {
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    productId: req.body.productId,
  });
  Product.findById(req.body.productId)
    .then((prod) => {
      if (prod) {
        order.save().then((doc) => {
          res.status(200).json({
            message: "New Order Recieved",
            order: doc,
            product: prod,
          });
        });
      } else {
        res.status(200).json({
          error: "Product Not Found",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        message: "Order Creation Failed",
        error: err,
      });
    });
});

route.get("/:prodId", (req, res, next) => {
  const id = req.params.prodId;
  Order.where("productId", id)
    .populate("productId")
    .exec()
    .then((doc) => {
      if (doc && doc.length > 0) {
        res.status(200).json({
          orders: doc,
          message: "Orders Against Product",
        });
      } else {
        res.status(404).json({
          err: "No Orders Found Against This Prod",
        });
      }
    })
    .catch((err) =>
      res.status(400).json({
        error: err,
      })
    );
});

module.exports = route;
