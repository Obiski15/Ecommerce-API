const multer = require("multer");
const AppError = require("../utils/AppError");

const storage = multer.memoryStorage({
  fileFilter: (req, file, cb) => {
    if (["img/jgp", "img/png"].includes(file.mimetype)) return cb(null, true);

    return cb(new AppError("Ivalid image type"), false);
  },
  filename: (req, file, cb) =>
    cb(null, `${file.filename.split(" ").join("-")}`),
});

const multerUpload = multer({ storage });

module.exports = multerUpload;
