const express = require("express");

const authGuestUser = require("../middlewares/auth/authGuestUser");
const { getOrders } = require("../controller/orderController");
const handleGuestError = require("../utils/handleGuestError");

const router = express.Router();

router.route("/").get(authGuestUser(handleGuestError), getOrders);

module.exports = router;
