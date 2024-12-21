const mongoose = require("mongoose");

const {
  calculateDeliveryFee,
  calculateFinalPrice,
} = require("../utils/helpers/helpers");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guest: String,
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
    totalDiscount: { type: Number, default: 0 },
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
    .map((product) =>
      calculateDeliveryFee(
        product.quantity,
        product.product.specifications.specs.weight,
      ),
    )
    .reduce((acc, price) => acc + price, 0)
    .toFixed(2);

  this.totalDiscount = +doc.items
    .map((product) => product.quantity * product.product.discount)
    .reduce((acc, price) => acc + price, 0)
    .toFixed(2);

  this.finalPrice = calculateFinalPrice(
    this.totalPrice,
    this.deliveryFee,
    this.totalDiscount,
  );

  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
