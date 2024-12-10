const catchAsync = require("../utils/catchAsync");
const User = require("../model/userModel");

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

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findOneAndDelete({ _id: req.user._id });

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({ status: "success" });
});
