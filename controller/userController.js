const User = require("../model/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getUser = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    status: "success",
  });
});

exports.deleteUser = catchAsync(async (req, res, next) =>
  next(new AppError("Route not yet defined", 404)),
);
