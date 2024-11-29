const Order = require("../model/orderModel");
const ApiFeatures = require("../utils/ApiFeatures");
const catchAsync = require("../utils/catchAsync");

exports.getOrders = catchAsync(async (req, res, next) => {
  const query = new ApiFeatures(Order.find({ user: req.user._id }), req.query)
    .sort()
    .paginate();

  const orders = await query.query;

  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {});
