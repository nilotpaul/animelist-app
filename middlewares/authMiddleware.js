const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const User = require("../lib/schema/userSchema");

const protectRoutes = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.jwt) {
    try {
      token = req.cookies.jwt;

      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(verifiedToken.id).select("-password");

      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: "Invalid credentials" });
      throw new Error("Invalid credentials");
    }
  }

  if (!token) {
    res.status(401).redirect("/");
    throw new Error("Unauthorized access");
  }
});

module.exports = protectRoutes;
