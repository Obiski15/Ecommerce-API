const mongoose = require("mongoose");

const Wishlist = require("../model/wishlistModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getWishlist = catchAsync(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user })
    .populate("items")
    .exec();

  res.status(200).json({
    status: "success",
    data: { wishlist },
  });
});

exports.deletefromWishlist = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id))
    return next(new AppError("Invalid or Missing a product id", 400));

  await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { items: id } },
  );

  res.status(200).json({
    status: "success",
  });
});

exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id))
    return next(new AppError("Invalid or Missing a product id", 400));

  await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $addToSet: { items: id } },
    { upsert: true }, // creates the wishlist if it doesn't exist
  );

  res.status(201).json({
    status: "success",
  });
});
