module.exports = (req, res, next) => {
  let guestId;

  if (req.cookies.guestId) {
    // eslint-disable-next-line
    guestId = req.cookies.guestId;
  } else {
    guestId = crypto.randomUUID();
    res.cookie("guestId", guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      expires: new Date(
        Date.now() + +process.env.GUEST_USER_EXPIRES_IN * 24 * 60 * 60 * 1000,
      ),
    });
  }

  req.userType = "guest";
  req.guestId = guestId;
  next();
};
