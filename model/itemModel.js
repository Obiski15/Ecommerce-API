const mongoose = require("mongoose");
const slugify = require("slugify");

const specificationsSchema = new mongoose.Schema({
  weight: Number,
  origin: String,
  material: String,
  color: String,
  barcode: Number,
});

const itemSchema = new mongoose.Schema(
  {
    categories: {
      required: [true, "Item categories is required"],
      type: [String],
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Item description is required"],
      lowercase: true,
      trim: true,
    },
    discount: Number,
    images: {
      required: [true, "A minimum of one image is required"],
      type: [String],
      trim: true,
    },
    photo: {
      type: String,
      required: [true, "Item photo is required"],
      trim: true,
    },
    price: Number,
    name: {
      type: String,
      required: [true, "Item name is required"],
      lowercase: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    specifications: {
      features: {
        type: [String],
        lowercase: true,
        trim: true,
      },
      specs: specificationsSchema,
    },
    stock: {
      type: Number,
      required: [true, "Number of available products wasn't provided"],
    },
  },
  { timestamps: true },
);

itemSchema.index({ name: "text", description: "text" });

itemSchema.index({ categories: 1 });

itemSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    replacement: "-",
    lower: true,
    trim: true,
  });

  next();
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
