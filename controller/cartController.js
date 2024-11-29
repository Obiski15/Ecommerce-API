const mongoose = require("mongoose");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Cart = require("../model/cartModel");
const Item = require("../model/itemModel");

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("items.product")
    .exec();

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: [], totalPrice: 0 } },
  );

  res.status(200).json({
    status: "success",
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  // check for product if and it is a valid mongoose objectId
  if (!productId || !mongoose.Types.ObjectId.isValid(productId))
    return next(new AppError("Invalid or Missing a product id", 400));

  // throw an error if item is not found
  const item = await Item.findOne({ _id: productId });

  if (!item)
    return next(new AppError("Product not found. Invalid Product id", 404));

  const cart = await Cart.findOne({ user: req.user._id });

  // if there is no cart associated with user, create a new cart
  if (!cart) {
    const newCart = new Cart();
    newCart.items.push({ product: item, quantity: 1 });
    newCart.user = req.user._id;

    await newCart.save({ validateBeforeSave: true });
  }

  if (cart) {
    // check if product is in cart.
    const productIndex = cart.items.findIndex(
      (product) => product.product._id.toString() === productId,
    );

    // if product is in cart update total price and quantity;
    if (productIndex > -1) {
      cart.items[productIndex].quantity += 1;
    } else {
      // if item is not in cart, add item
      cart.items.push({ product: productId, quantity: 1 });
    }

    // save to db
    cart.save({ validateBeforeSave: true });
  }

  res.status(200).json({
    status: "success",
  });
});

exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId))
    return next(new AppError("Invalid or Missing a product id", 400));

  const item = await Item.findOne({ _id: productId });

  if (!item) return next(new AppError("Invalid Product id", 400));

  // find cart
  const cart = await Cart.findOne({ user: req.user._id });

  // throw an error if cart's not found
  if (!cart) return next(new AppError("Cart not found", 404));

  // find product to be updated
  const itemIndex = cart.items.findIndex(
    (product) => product.product._id.toString() === productId,
  );

  // if product is not in cart, throw an error
  if (itemIndex < 0) return next(new AppError("Item not in cart", 403));

  // if product is in cart, check if quantity is === 1 to remove item else substract one item
  if (cart.items[itemIndex].quantity === 1) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity -= 1;
  }

  // save to DB
  cart.save({ validateBeforeSave: true });

  res.status(200).json({
    status: "success",
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId))
    return next(new AppError("Invalid or Missing a product id", 400));

  const item = await Item.findOne({ _id: productId });

  if (!item) return next(new AppError("Invalid Product id", 400));

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { items: { product: item._id } } },
    { new: true },
  );

  if (!cart) return next(new AppError("Cart not found", 404));

  cart.save({ validateBeforeSave: true });

  res.status(200).json({
    status: "success",
  });
});
