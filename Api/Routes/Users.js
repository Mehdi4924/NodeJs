const express = require("express");
const route = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
//encrypt password using this bycrypt
var bcrypt = require("bcryptjs");
//used for access token
var jwt = require("jsonwebtoken");
import auth_key from "../AuthCheck/AuthKey";
//add as first middleware in the request and get Auth For Your User
const authCheck = require("../AuthCheck/AuthCheck");

route.post("/signUp", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((doc) => {
      if (doc.length >= 1) {
        res.status(401).json({
          error: "Email Already Exisit",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: "Internal Server Error",
              err: err,
            });
          } else {
            const userData = User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            userData
              .save()
              .then((doc) => {
                res.status(200).json({
                  message: "User Created",
                  data: doc,
                });
              })
              .catch((err) => {
                console.log("error on req", err);
                res.status(400).json({
                  message: "Error Occoured",
                  err: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log("error on req", err);
      res.status(500).json({
        err: err,
      });
    });
});

route.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((doc) => {
      if (doc.length < 1) {
        res.status(404).json({
          err: "User Doesn't Exist",
        });
      } else {
        bcrypt.compare(req.body.password, doc[0].password, (err, success) => {
          if (err) {
            return res.status(401).json({
              err: "Passowrd Dont Match",
              body: err,
            });
          } else if (success) {
            const userToken = jwt.sign(
              {
                email: doc[0].email,
                _id: doc[0]._id,
              },
              auth_key,
              {
                expiresIn: "1h",
              }
            );
            const newDoc = doc[0];
            return res.status(200).json({
              message: "Sucessfull!",
              body: { ...newDoc._doc, userToken },
            });
          } else {
            return res.status(401).json({
              err: "Passowrd Dont Match",
            });
          }
        });
      }
    })
    .catch((err) => {});
});

module.exports = route;
