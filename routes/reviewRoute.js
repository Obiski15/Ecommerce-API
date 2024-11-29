const express = require("express");
const {
  getReviewsByProductId,
  getReviews,
  addReview,
  deleteReview,
} = require("../controller/reviewController");
const { protect, restrictUser } = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(protect, restrictUser("admin"), getReviews)
  .post(protect, addReview)
  .delete(protect, restrictUser("admin"), deleteReview);

router.route("/:productId").get(getReviewsByProductId);

module.exports = router;
