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
    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "btc", "bank transfer"],
      lowercase: true,
      trim: true,
    },
    paymentResult: {
      id: String,
      status: {
        type: String,
        enum: ["processing", "success", "failed"],
        default: "processing",
        lowercase: true,
        trim: true,
      },
      update_time: Date,
      email_address: {
        type: String,
        lowercase: true,
        trim: true,
      },
    },
    discount: Number,
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
