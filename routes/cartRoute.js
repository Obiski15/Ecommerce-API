const express = require("express");

const mergeGuestCart = require("../middlewares/cart/mergeGuestCart");
const authGuestUser = require("../middlewares/auth/authGuestUser");
const handleGuestId = require("../utils/handleGuestId");
const {
  getCart,
  addToCart,
  clearCart,
  removeFromCart,
  removeItemFromCart,
} = require("../controller/cartController");

const router = express.Router();

router
  .route("/")
  .get(authGuestUser(handleGuestId), mergeGuestCart, getCart)
  .delete(authGuestUser(handleGuestId), clearCart);

router
  .route("/removeItemFromCart")
  .post(authGuestUser(handleGuestId), removeItemFromCart);
router
  .route("/removeFromCart")
  .post(authGuestUser(handleGuestId), removeFromCart);
router.route("/addToCart").post(authGuestUser(handleGuestId), addToCart);

module.exports = router;
