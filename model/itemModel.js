const mongoose = require("mongoose");

const specificationsSchema = new mongoose.Schema({
  weight: Number,
  origin: String,
  material: String,
  color: String,
  barcode: Number,
});

const itemSchema = new mongoose.Schema(
  {
    categories: [String],
    description: String,
    discount: Number,
    images: [String],
    photo: String,
    price: Number,
    name: String,
    slug: String,
    specifications: {
      features: [String],
      specs: specificationsSchema,
    },
    stock: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true },
);

itemSchema.index({ name: "text", description: "text" });

itemSchema.index({ categories: 1 });

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
