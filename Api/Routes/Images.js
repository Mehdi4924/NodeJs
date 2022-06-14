const express = require("express");
const route = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const Images = require("../models/images");

//storage options
const storageOptions = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Imagesupload/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//filter files
const filter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//limit size
const uploadFile = multer({
  storage: storageOptions,
  limits: {
    fileSize: 1024 * 1024 * 5, //5MB
  },
  fileFilter: filter,
});

route.post("/", uploadFile.single("image"), (req, res, next) => {
  console.log(req.file);
  const image = new Images({
    _id: mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    fileUrl: "http://localhost:3000/" + req.file.filename,
  });
  image.save().then((doc) => {
    res.status(200).json({
      doc: doc,
      //   file: req.file.path,
    });
  });
});

module.exports = route;
