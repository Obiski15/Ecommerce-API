const Category = require("../model/categoryModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const category = await Category.findOne({ name: req.params.categoryId });

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.addCategory = catchAsync(async (req, res, next) =>
  next(new AppError("method not allowed", 403)),
);

exports.deleteCategory = catchAsync(async (req, res, next) =>
  next(new AppError("method not allowed", 403)),
);

exports.editCategory = catchAsync(async (req, res, next) =>
  next(new AppError("method not allowed", 403)),
);
