const mongoSanitise = require("express-mongo-sanitize");
const rateLimiter = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const xss = require("xss-clean");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");

const { webhook } = require("./controller/paymentController");
const errorHandler = require("./controller/errorController");

const categoryRoute = require("./routes/categoryRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const paymentRoute = require("./routes/paymentRoute");
const reviewRoute = require("./routes/reviewRoute");
const orderRoute = require("./routes/orderRoute");
const itemRoute = require("./routes/itemRoute");
const cartRoute = require("./routes/cartRoute");
const userRoute = require("./routes/userRoute");
// eslint-disable-next-line
const adminRoute = require("./admin/adminRoute");

const app = express();

app.use(helmet());

app.use(
  rateLimiter({
    windowMs: 60 * 60 * 1000,
    limit: 1000,
    message: "Too many requests. Try again in an hour",
  }),
);

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// parse request cookies into req.cookies
app.use(cookieParser());

// parse raw data for stripe webhook
app.post("/api/v1/webhook", express.raw({ type: "application/json" }), webhook);

// parse request body into req.body
app.use(express.json());

// cross origin policy
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || process.env.ALLOWED_ORIGINS.split(",").includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Origin not allowed. Blocked by cors.."));
      }
    },
    credentials: true,
  }),
);

// prevents parameter pollution
app.use(hpp());

// // prevents against xss attacks
app.use(xss());

// // sanitize request parameters
app.use(mongoSanitise());

// api routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/items", itemRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/user", userRoute);

// admin route
app.use("/api/v1/admin", adminRoute);

// handle app error
app.use(errorHandler);

module.exports = app;
