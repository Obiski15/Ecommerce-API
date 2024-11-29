const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "A valid Email Address is required"],
      validate: {
        validator: (val) => validator.isEmail(val),
        message: "Kindly provide a valid email address",
      },
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password field is required"],
      minLength: [8, "Minimum required length is 8"],
      select: false,
    },
    confirmPassword: {
      required: [true, "Kindly confirm your password"],
      type: String,
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: "Password must match",
      },
      minLength: [8, "Minimum required length is 8"],
    },
    firstName: {
      type: String,
      required: [true, "Kindly Provide a first name"],
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: [true, "Kindly Provide a last name"],
      trim: true,
      lowercase: true,
    },
    tel: {
      type: Number,
      required: [true, "Kindly provide a phone number"],
    },
    image: String,
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },
    shippingAddress: {
      address: { type: String, lowercase: true, trim: true },
      city: { type: String, lowercase: true, trim: true },
      region: { type: String, lowercase: true, trim: true },
      postalCode: { type: Number, lowercase: true, trim: true },
      country: {
        type: String,
        lowercase: true,
        trim: true,
      },
      additionalInfo: { type: String, lowercase: true, trim: true },
    },
    userAddress: {
      address: { type: String, lowercase: true, trim: true },
      city: { type: String, lowercase: true, trim: true },
      region: { type: String, lowercase: true, trim: true },
      country: {
        type: String,
        lowercase: true,
        trim: true,
      },
    },
    password_changed_at: Date,
    resetToken: String,
    resetTokenExpiresAt: Number,
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 16);
  this.confirmPassword = undefined;

  if (!this.isNew) {
    this.password_changed_at = new Date();
  }
  next();
});

userSchema.methods.comparePassword = async function (
  registeredPassword,
  userPassword,
) {
  return await bcrypt.compare(registeredPassword, userPassword);
};

userSchema.methods.confirmPasswordChange = function (tokenIssuedAt) {
  return new Date(this.password_changed_at).getTime() / 1000 > tokenIssuedAt;
};

userSchema.methods.createResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  this.resetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
  this.resetToken = hashedToken;

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
