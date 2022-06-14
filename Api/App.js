const express = require("express");
const app = express();
//moragan is used to check if the request has arrived and what is the payload with it
const morgan = require("morgan");
//body parser is used to parse the body of the incoming request
const bodyParser = require("body-parser");
//mongoose is used to connect to cloud server
const mongoose = require("mongoose");
//connect using mongoose
const dbURL =
  "mongodb+srv://Iftikharmehdi4924:" +
  process.env.MONGO_ATLAS_PW +
  "@cluster0.xq3mhd0.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(dbURL);
//Routes
const productRoutes = require("./Routes/Product");
const orderRoutes = require("./Routes/Orders");
const imageRoutes = require("./Routes/Images");
//Parser Adding
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Morgan Adding
app.use(morgan("dev"));
//this is required in order to show the images to the users because this folder is not available to everyone
app.use(express.static("Imagesupload"));
//Routes
app.use("/products", productRoutes);
app.use("/order", orderRoutes);
app.use("/image", imageRoutes);
//Handle CORS errors, CORS errors are about who can access the server you are running
app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  req.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,PATCH");
    return res.status(200).json({});
  }
  next();
});
// If request is not found in the routes this is triggered
app.use((req, res, next) => {
  const error = new Error("404 Request Not Found");
  error.status(404);
  next(error);
});
// If request is not found in the routes and we want to return error message
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500);
  res.json({
    message: "Error Occoured Processing Request",
  });
});
module.exports = app;
