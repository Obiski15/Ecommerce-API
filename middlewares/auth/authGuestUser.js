const jwt = require("jsonwebtoken");

const AppError = require("../../utils/AppError");
const User = require("../../model/userModel");

module.exports = (cb) => async (req, res, next) => {
  try {
    let payload;
    let token;

    if (req.headers.authorization) {
      if (!req.headers.authorization.startsWith("Bearer"))
        throw new AppError("Invalid or missing auth token", 400);
      token = req.headers.authorization.split(" ")[1];
    } else {
      token = req.cookies.jwt;
    }

    // check if token is available;
    if (!token) {
      if (!token) throw new AppError("Missing auth Token", 400);
    }

    // verify token;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return cb(req, res, next, err);
    }

    // find user
    const user = await User.findOne({ _id: payload.id });

    if (!user) {
      if (!user) throw new AppError("User not found", 401);
    }

    const passwordChanged = await user.confirmPasswordChange(payload.iat);

    if (passwordChanged) {
      throw new AppError("Password changed since last login. Login again", 401);
    }

    req.userType = "returning";
    req.user = user;
    next();
  } catch (err) {
    if (err.isOperational) {
      return cb(req, res, next, err);
    }
    next(err);
  }
};
