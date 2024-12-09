const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");

module.exports = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("Access Denied", 403));

    next();
  });
