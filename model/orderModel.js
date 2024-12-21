const mongoose = require("mongoose");

const {
  calculateDeliveryFee,
  calculateFinalPrice,
} = require("../utils/helpers/helpers");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    shippingAddress: {
      address: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      postalCode: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
    },
    paymentResult: {
      type: String,
      select: false,
    },
    itemPrice: { type: Number, required: true },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "order placed",
        "delivered",
        "cancelled - failed delivery",
        "processing",
        "cancelled - failed payment",
      ],
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    weight: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    deliveryFee: { type: Number, required: true, default: 0 },
    amountPaid: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true },
);

orderSchema.pre("save", async function (next) {
  this.deliveryFee = calculateDeliveryFee(this.quantity, this.weight);
  this.amountPaid = calculateFinalPrice(
    this.itemPrice,
    this.deliveryFee,
    this.discount,
  );

  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
