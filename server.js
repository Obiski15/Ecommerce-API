const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT_EXCEPTION 💥");
  console.log("shutting down...");
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: "./.env" });

const app = require("./app");

const DB = process.env.MONGO_URL.replace(
  "%PASSWORD%",
  process.env.MONGO_DB_PASSSWORD,
);

mongoose
  .connect(DB, {
    dbName: "ruvid-store",
  })
  .then((con) => {
    console.log("connection successful");
  });

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED_REJECTION 💣");
  console.log("shutting down....");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
