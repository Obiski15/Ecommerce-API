const express = require("express");
const {
  retrievePaymentIntent,
  createPaymentIntent,
} = require("../controller/paymentController");
const protect = require("../middlewares/auth/protect");

const router = express.Router();

router.route("/retrieve_intent").post(protect, retrievePaymentIntent);
router.route("/create_intent").post(protect, createPaymentIntent);

module.exports = router;
