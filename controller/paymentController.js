const stripe = require("stripe")(process.env.STRIPE_SK);
const { CronJob } = require("cron");

const AppError = require("../utils/AppError");
const Order = require("../model/orderModel");
const Cart = require("../model/cartModel");

function handleOrderStatusUpdate(orders, user, paymentId) {
  const date = new Date().getTime();

  // resolve date to Cron time format
  const processingTime = () => {
    const processingDate = new Date(date + 60 * 1000);

    const seconds = processingDate.getSeconds();
    const minutes = processingDate.getMinutes();
    const dayOfMonth = processingDate.getDate();
    const month = processingDate.getMonth() + 1;
    const hours = processingDate.getHours();

    return `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} *`;
  };

  const deliveryTime = () => {
    const deliveryDate = new Date(date + 24 * 60 * 60 * 1000);

    const seconds = deliveryDate.getSeconds();
    const minutes = deliveryDate.getMinutes();
    const dayOfMonth = deliveryDate.getDate();
    const month = deliveryDate.getMonth() + 1;
    const hours = deliveryDate.getHours();

    return `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} *`;
  };

  [
    { time: processingTime, status: "processing" },
    { time: deliveryTime, status: "delivery" },
  ].forEach(({ time, status }) => {
    orders.forEach(() => {
      const job = new CronJob(
        time(),
        async () => {
          await Order.findOneAndUpdate(
            { user, paymentResult: paymentId },
            { status },
            { runValidators: true },
          );

          job.stop();
        },
        null,
        true,
      );
    });
  });
}

async function handleSuccessfulPayment(event) {
  const { metadata, id } = event.data.object;

  const cart = await Cart.findOne({ _id: metadata.cart }).populate([
    "items.product.specifications.specs",
    "items.product",
    "user",
  ]);

  const orders = cart.items.map((item) =>
    Order.create({
      user: cart.user,
      paymentResult: id,
      deliveryMode: metadata.deliveryMode,
      weight: item.product.specifications.specs.weight,
      shippingAddress: {
        postalCode: cart.user.shippingAddress.postalCode,
        country: cart.user.shippingAddress.country,
        address: cart.user.shippingAddress.address,
        city: cart.user.shippingAddress.city,
      },
      isPaid: true,
      paidAt: new Date(),
      productId: item.product._id,
      itemPrice: item.product.price,
      image: item.product.photo,
      name: item.product.name,
      quantity: item.quantity,
      discount: item.product.discount,
      status: "order placed",
    }),
  );

  const result = await Promise.all(orders);
  await cart.deleteOne();

  // manually adjust delivery status
  handleOrderStatusUpdate(result, cart.user._id, id);
}

async function handleFailedPayment(event) {
  const { metadata, id } = event.data.object;

  const cart = await Cart.findOne({ _id: metadata.cart }).populate([
    "items.product.specifications.specs",
    "items.product",
    "user",
  ]);

  const orders = cart.items.map((item) =>
    Order.create({
      user: cart.user,
      paymentResult: id,
      deliveryMode: metadata.deliveryMode,
      weight: item.product.specifications.specs.weight,
      shippingAddress: {
        postalCode: cart.user.shippingAddress.postalCode,
        country: cart.user.shippingAddress.country,
        address: cart.user.shippingAddress.address,
        city: cart.user.shippingAddress.city,
      },
      paidAt: new Date(),
      productId: item.product._id,
      itemPrice: item.product.price,
      image: item.product.photo,
      name: item.product.name,
      quantity: item.quantity,
      discount: item.product.discount,
      status: "cancelled - failed payment",
    }),
  );
  await Promise.all(orders);
  await cart.deleteOne();
}

exports.createPaymentIntent = async (req, res, next) => {
  const { amount, deliveryMode } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );
    const description = cart.items
      .map((item) => `${item.quantity} ${item.product.name}`)
      .join(", ");

    const intent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      description: description,
      shipping: {
        address: {
          city: req.user.shippingAddress.city,
          state: req.user.shippingAddress.region,
          line1: req.user.shippingAddress.address,
          country: req.user.shippingAddress.country,
          postal_code: req.user.shippingAddress.postalCode,
        },
        name: `${req.user.firstName} ${req.user.lastName}`,
      },
      metadata: {
        cart: cart._id.toString(),
        deliveryMode,
      },
      payment_method_types: ["card"],
    });

    res.status(201).json({
      data: {
        client_secret: intent.client_secret,
      },
    });
  } catch (err) {
    next(new AppError("Unable to process your request. Please try again", 500));
  }
};

exports.retrievePaymentIntent = async (req, res, next) => {
  try {
    const { status, id, amount, description } =
      await stripe.paymentIntents.retrieve(req.body.paymentId);
    res.status(200).json({
      data: {
        intent: { id, amount, status, description },
      },
    });
  } catch (err) {
    next(
      new AppError("Unable to retrive payment Intent. Please try again", 500),
    );
  }
};

exports.webhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SIG,
    );
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle webhook intent event
  switch (event.type) {
    case "payment_intent.succeeded":
      handleSuccessfulPayment(event);
      break;
    case "payment_intent_payment_failed":
      handleFailedPayment(event);
      break;
    default:
      break;
  }

  res.status(200).json({ received: true });
};
