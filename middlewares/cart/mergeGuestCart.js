const catchAsync = require("../../utils/catchAsync");
const Cart = require("../../model/cartModel");

async function mergeCart(user, item) {
  const cart = await Cart.findOne({ user });

  if (!cart) {
    const newCart = new Cart();

    newCart.items.push(item);
    newCart.user = user;

    await newCart.save({ validateBeforeSave: true });
  } else {
    const productIndex = cart.items.findIndex(
      (itm) => itm.product.toString() === item.product.toString(),
    );

    if (productIndex > -1) {
      cart.items[productIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
    await cart.save({ validateBeforeSave: true });
  }
}

module.exports = catchAsync(async (req, res, next) => {
  if (req.user && req.userType === "returning" && req.cookies.guestId) {
    const guestCart = await Cart.findOne({ guest: req.cookies.guestId });

    // check if the cart items length is greater than zero
    if (guestCart && guestCart.items.length > 0) {
      const mergePromises = guestCart.items.map((item) =>
        mergeCart(req.user._id, {
          product: item.product,
          quantity: item.quantity,
        }),
      );

      await Promise.all(mergePromises);

      // delete cart
      await Cart.findOneAndDelete({ _id: guestCart._id });
    }

    // clear cookie
    res.clearCookie("guestId", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
  }

  next();
});
