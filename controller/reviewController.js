const ApiFeatures = require("../utils/ApiFeatures");
const catchAsync = require("../utils/catchAsync");
const Review = require("../model/reviewModel");

exports.getReviewsByProductId = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const query = new ApiFeatures(Review.find({ product: productId }), req.query)
    .paginate()
    .sort();

  const reviews = await query.query.populate("user").exec();

  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
});

exports.getReviews = catchAsync(async (req, res, next) => {
  const query = new ApiFeatures(Review.find({}), req.query).paginate().sort();
  const reviews = await query.query;

  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
});

exports.addReview = catchAsync(async (req, res, next) => {
  const data = {
    product: req.body.productId,
    user: req.body.userId,
    rating: req.body.rating,
    comment: req.body.comment,
  };

  const review = await Review.create({ ...data });

  res.status(201).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await Review.findByIdAndDelete(req.body.reviewId);

  res.status(200).json({
    status: "success",
  });
});
