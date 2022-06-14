const express = require("express");
const { router } = require("../App");
const route = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");

route.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      if (docs.length < 1) {
        res.status(400).json({
          error: "No Data Found",
        });
      } else {
        res.status(200).json({
          allProducts: docs,
        });
      }
    })
    .catch((err) => {
      res.status(200).json({
        error: err,
      });
    });
});

route.post("/addProduct", (req, res, next) => {
  const productData = Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  console.log("product data incoming", productData);
  productData
    .save()
    .then((doc) => {
      res.status(200).json({
        message: "New Product Added",
        product: doc,
      });
      next();
    })
    .catch((err) => {
      console.log("this error occoured", err);
      res.status(400).json({
        message: err,
      });
    });
});

route.post("/updateProduct", (req, res, next) => {
  console.log("req", req);
  const newData = {
    name: req?.body?.name,
    price: req?.body?.price,
  };
  Product.updateOne({ _id: req.body._id }, { $set: newData })
    .exec()
    .then((doc) => {
      res.status(200).json({
        message: "Product Updated",
        product: doc,
      });
      next();
    })
    .catch((err) => {
      console.log("this error occoured", err);
      res.status(400).json({
        message: err,
      });
    });
});

route.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    // .select("_id name price") // used to fetch specific properties out of obj
    .exec()
    .then((docs) => {
      if (docs) {
        res.status(200).json({
          product: docs,
        });
      } else {
        res.status(400).json({
          error: "Invalid Id",
        });
      }
    })
    .catch((err) => {
      console.log("this erorr occoured", err);
      res.status(400).json({
        error: err,
      });
    });
});

route.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((docs) => {
      res.status(200).json({
        error: "Product Deleted Succesfully",
        product: docs,
      });
    })
    .catch((err) => {
      console.log("this erorr occoured", err);
      res.status(400).json({
        error: err,
      });
    });
});

module.exports = route;
