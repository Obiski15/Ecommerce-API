const express = require("express");
const {
  getCategories,
  addCategory,
  deleteCategory,
  editCategory,
  getCategory,
} = require("../controller/categoryController");
const { protect, restrictUser } = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(protect, restrictUser("admin"), addCategory);

router
  .route("/:categoryId")
  .get(getCategory)
  .delete(protect, restrictUser("admin"), deleteCategory)
  .patch(protect, restrictUser("admin"), editCategory);

module.exports = router;
