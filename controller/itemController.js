const ApiFeatures = require("../utils/ApiFeatures");
const catchAsync = require("../utils/catchAsync");
const Item = require("../model/itemModel");

exports.getItems = catchAsync(async (req, res, next) => {
  const query = new ApiFeatures(Item.find({}), req.query)
    .paginate()
    .sort()
    .getItemsByCategory();

  const items = await query.query;

  res.status(200).json({
    status: "success",
    data: {
      count: items.length,
      items,
    },
  });
});

exports.getItem = async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      item,
    },
  });
};

exports.getHints = catchAsync(async (req, res, next) => {
  const { query } = req.params;

  const items = await Item.find(
    {
      $or: [
        { name: { $regex: new RegExp(`^${query}`), $options: "i" } },
        {
          description: { $regex: new RegExp(`\\b${query}\\b`), $options: "i" },
        },
      ],
    },
    { name: 1 },
  ).limit(10);

  const hints = items.map((item) => item.name);

  res.status(200).json({
    status: "success",
    data: {
      count: items.length,
      hints,
    },
  });
});

exports.searchItems = catchAsync(async (req, res, next) => {
  const query = new ApiFeatures(
    Item.find({ $text: { $search: `"${req.params.query}"` } }),
    req.query,
  )
    .sort()
    .paginate()
    .priceRange()
    .getItemsByCategory();

  const items = await query.query;

  res.status(200).json({
    status: "success",
    data: {
      count: items.length,
      items,
    },
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  await Item.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
  });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const item = await Item.findByIdAndUpdate(req.params.id, { ...req.body });

  res.status(200).json({
    status: "success",
    data: {
      item,
    },
  });
});
