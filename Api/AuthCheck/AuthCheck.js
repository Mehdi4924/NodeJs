var jwt = require("jsonwebtoken");
import auth_key from "./AuthKey";

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, auth_key);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      err: "Un Authorized",
    });
  }
};
