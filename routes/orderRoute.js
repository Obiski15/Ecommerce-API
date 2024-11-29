const express = require("express");
const { getOrders } = require("../controller/orderController");
const { protect } = require("../controller/authController");

const router = express.Router();

// router.post("/placeOrder", protect, placeOrder);
router.route("/").get(protect, getOrders);

module.exports = router;
