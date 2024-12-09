const express = require("express");

const restrictUser = require("../middlewares/auth/restrictUser");
const protect = require("../middlewares/auth/protect");

const {
  getReviewsByProductId,
  getReviews,
  addReview,
  deleteReview,
} = require("../controller/reviewController");

const router = express.Router();

router
  .route("/")
  .get(protect, restrictUser("admin"), getReviews)
  .post(protect, addReview)
  .delete(protect, restrictUser("admin"), deleteReview);

router.route("/:productId").get(getReviewsByProductId);

module.exports = router;
