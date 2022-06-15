const express = require("express");
const route = express.Router();
const userController = require("../Controllers/users");

route.post("/signUp", userController.user_signup);
route.post("/login", userController.user_login);

module.exports = route;
