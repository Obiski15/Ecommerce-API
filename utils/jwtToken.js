const AppError = require("./AppError");

module.exports = (req, next) => {
  let token;

  if (req.headers.authorization) {
    if (!req.headers.authorization.startsWith("Bearer"))
      return next(new AppError("Invalid or missing auth token", 400));
    token = req.headers.authorization.split(" ")[1];
  } else {
    token = req.cookies.jwt;
  }

  return token;
};
