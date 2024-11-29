const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "btc", "bank transfer"],
    },
    paymentResult: {
      id: String,
      status: {
        type: String,
        enum: ["processing", "success", "failed"],
        default: "processing",
      },
      update_time: String,
      email_address: String,
    },
    discount: Number,
    itemPrice: { type: Number, required: true },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "delivered",
        "cancelled - failed delivery",
        "processing",
        "cancelled - failed payment",
      ],
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    shippingFee: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
