const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const catchAsync = require("../utils/catchAsync");
const sendMail = require("../utils/sendMail");
const AppError = require("../utils/AppError");
const User = require("../model/userModel");

function signToken(id) {
  return jwt.sign(id, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function createSendToken(user, res, statusCode) {
  const token = signToken({ id: user._id });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    expires: new Date(
      Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
    },
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({ ...req.body });

  createSendToken(user, res, 201);
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Email and Password fields are required", 400));

  const user = await User.findOne({ email }).select("+password");

  const verifyPassword = await user.comparePassword(password, user.password);

  if (!verifyPassword)
    return next(new AppError("Invalid Login Credentials", 400));

  createSendToken(user, res, 200);
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError("invalid email address", 404));

  // if there is a user, create reset token
  const resetToken = await user.createResetToken();
  await user.save({ validateBeforeSave: false });

  // reset link
  const resetURL = `${req.headers.origin}/reset-password/${resetToken}`;

  // send mail
  try {
    await sendMail({
      subject: "Password reset request",
      to: req.body.email,
      html: `
      <p>Hi, ${user.firstName}}</p>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <a href="${resetURL}">Reset Password</a>
      <p>This link will expire in 10 mins. If you did not request this, please ignore this email.</p>
      <p>Thank you,<br>The [Ruvid Store] Team</p>
      `,
    });

    res.status(201).json({
      status: "success",
    });
  } catch (error) {
    // if there is an error sending mail, revert process so user can try again
    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("unable to process your request", 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword)
    return next(new AppError("password fields are required", 400));

  // get user based on token;
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({ resetToken: hashedResetToken });

  if (!user || Date.now() > user.resetTokenExpiresAt)
    return next(new AppError("invalid or expired token", 401));

  // reset token and update password
  user.confirmPassword = confirmPassword;
  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpiresAt = undefined;

  // save to DB
  await user.save({ validateBeforeSave: true });

  // create and send token
  createSendToken(user, res, 201);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie("jwt");

  res.status(200).json({ status: "success" });
});
