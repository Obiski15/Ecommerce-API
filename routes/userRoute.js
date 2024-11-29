const express = require("express");
const {
  signup,
  login,
  restrictUser,
  protect,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controller/authController");
const {
  updateUser,
  deleteUser,
  getUser,
} = require("../controller/userController");

const router = express.Router();

router.post("/resetPassword/:resetToken", resetPassword);
router.post("/forgotPassword", forgotPassword);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/login", login);

router
  .route("/")
  .delete(protect, restrictUser("admin"), deleteUser)
  .patch(protect, updateUser)
  .get(protect, getUser);

module.exports = router;
