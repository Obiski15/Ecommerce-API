module.exports = (_, res, next, err) => {
  if (err.isOperational) {
    res.status(200).json({
      status: "success",
      message: err.message,
      code: err.statusCode,
      data: null,
    });
  } else {
    next(err);
  }
};
