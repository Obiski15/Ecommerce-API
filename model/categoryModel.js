const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item category needs to be assigned a name"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      required: [true, "Item image needs to be assigned a value"],
      trim: true,
    },
    subCategory: { type: [String], lowercase: true },
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
