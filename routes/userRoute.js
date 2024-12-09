const express = require("express");

const authGuestUser = require("../middlewares/auth/authGuestUser");
const handleGuestError = require("../utils/handleGuestError");
const protect = require("../middlewares/auth/protect");
const {
  signup,
  login,
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
  .get(authGuestUser(handleGuestError), getUser)
  .delete(protect, deleteUser)
  .patch(protect, updateUser);

module.exports = router;
