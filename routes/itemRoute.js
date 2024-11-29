const express = require("express");
const {
  getItems,
  getItem,
  getItemsByName,
  deleteItem,
  updateItem,
  searchItems,
  getHints,
} = require("../controller/itemController");
const { protect, restrictUser } = require("../controller/authController");

const router = express.Router();

router.route("/").get(getItems);
router.route("/product/:productName").get(getItemsByName);
router.route("/search/:query").get(searchItems);
router.route("/hints/:query").get(getHints);
router
  .route("/:id")
  .get(getItem)
  .post(protect, restrictUser("admin"), deleteItem)
  .patch(protect, restrictUser("admin"), updateItem);

module.exports = router;