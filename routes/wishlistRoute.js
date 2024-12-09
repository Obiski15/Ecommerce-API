const express = require("express");

const authGuestUser = require("../middlewares/auth/authGuestUser");
const handleGuestError = require("../utils/handleGuestError");
const protect = require("../middlewares/auth/protect");
const {
  getWishlist,
  addToWishlist,
  deletefromWishlist,
} = require("../controller/wishlistController");

const router = express.Router();

router
  .route("/")
  .get(authGuestUser(handleGuestError), getWishlist)
  .post(protect, addToWishlist)
  .delete(protect, deletefromWishlist);

module.exports = router;
