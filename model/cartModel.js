const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
    deliveryFee: { type: Number, required: true, default: 0 },
    finalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

cartSchema.pre("save", async function (next) {
  const doc = await this.populate("items.product");

  this.totalPrice = +doc.items
    .map((product) => product.quantity * product.product.price)
    .reduce((acc, price) => acc + price, 0)
    .toFixed(2);

  this.deliveryFee = +doc.items
    .map(
      (product) =>
        product.quantity * product.product.specifications.specs.weight * 2,
    )
    .reduce((acc, price) => acc + price, 0)
    .toFixed(2);

  this.finalPrice = this.deliveryFee + this.totalPrice;

  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
