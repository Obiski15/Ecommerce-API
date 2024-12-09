const jwt = require("jsonwebtoken");

const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");
const jwtToken = require("../../utils/jwtToken");
const User = require("../../model/userModel");

module.exports = catchAsync(async (req, res, next) => {
  const token = jwtToken(req, next);

  // throw an error if token doesn't exist
  if (!token) return next(new AppError("Missing auth Token", 400));

  // verify token
  const { id, iat } = jwt.verify(token, process.env.JWT_SECRET);

  // find user
  const user = await User.findById(id);

  if (!user) return next(new AppError("User not found", 401));

  // check last time user last changed password
  const passwordChanged = await user.confirmPasswordChange(iat);

  if (passwordChanged)
    return next(
      new AppError("Password changed since last login. Login again", 401),
    );

  req.user = user;

  next();
});
