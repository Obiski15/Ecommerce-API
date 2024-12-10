const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      lowercase: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
      trim: true,
    },
    subCategory: {
      type: [String],
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

// remove duplicate fields
categorySchema.pre("save", function (next) {
  this.subCategory = [...new Set(this.subCategory)];

  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
