const express = require("express");
const { uploadItem } = require("./controller");
const restrictUser = require("../middlewares/auth/restrictUser");
const protect = require("../middlewares/auth/protect");
const upload = require("./multerUpload");

const router = express.Router();

router
  .route("/item")
  .post(protect, restrictUser("admin"), upload.array("file"), uploadItem);

module.exports = router;
