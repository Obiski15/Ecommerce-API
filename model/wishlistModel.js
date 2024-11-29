const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
    ],
  },
  { timestamps: true },
);

const Wishlist = mongoose.model("WishList", wishListSchema);

module.exports = Wishlist;
