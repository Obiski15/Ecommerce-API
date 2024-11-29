const express = require("express");
const {
  getWishlist,
  addToWishlist,
  deletefromWishlist,
} = require("../controller/wishlistController");

const { protect } = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(protect, getWishlist)
  .post(protect, addToWishlist)
  .delete(protect, deletefromWishlist);

module.exports = router;
