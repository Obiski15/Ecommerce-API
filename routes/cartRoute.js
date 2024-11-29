const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  removeItemFromCart,
} = require("../controller/cartController");
const { protect } = require("../controller/authController");

const router = express.Router();

router.route("/").get(protect, getCart).delete(protect, clearCart);

router.route("/removeItemFromCart").post(protect, removeItemFromCart);
router.route("/removeFromCart").post(protect, removeFromCart);
router.route("/addToCart").post(protect, addToCart);

module.exports = router;
