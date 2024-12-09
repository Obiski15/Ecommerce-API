const express = require("express");

const restrictUser = require("../middlewares/auth/restrictUser");
const protect = require("../middlewares/auth/protect");
const {
  getCategories,
  addCategory,
  deleteCategory,
  editCategory,
  getCategory,
} = require("../controller/categoryController");

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
