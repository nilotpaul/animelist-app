const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const User = require("../lib/schema/userSchema");

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmp } = req.body;

  if (!name || !email || !password || !confirmp) {
    res.status(400).json({ message: "Invalid credentials" });
    throw new Error("Invalid credentials");
  }

  if (password !== confirmp) {
    res.status(400).json({ message: "Invalid credentials" });
    throw new Error("Invalid credentials");
  }

  const check = await User.findOne({ email });

  if (check) {
    res.status(409).json({ message: "user already exists" });
    throw new Error("user already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedP = await bcrypt.hash(password, salt);
  const hashedConfirmP = await bcrypt.hash(confirmp, salt);

  const createdUser = await User.create({
    name,
    email,
    password: hashedP,
    confirmp: hashedConfirmP,
  });

  if (createdUser) {
    res.status(201).json({
      id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      token: generateJwtToken(res, createdUser._id),
    });
  } else {
    res.status(400).json({ message: "cannot create user account" });
    throw new Error("cannot create user account");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "fields cannot be empty" });
    throw new Error("fields cannot be empty");
  }

  const check = await User.findOne({ email });

  if (!check) {
    res.status(404).json({ message: "user doesn't exist" });
  }

  if (await bcrypt.compare(password, check.password)) {
    res.status(200).json({
      id: check._id,
      name: check.name,
      email: check.email,
      token: generateJwtToken(res, check._id),
    });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
    throw new Error("Invalid credentials");
  }
});

const getUser = asyncHandler(async (req, res) => {
  const { id, name, email, createdAt, updatedAt } = await User.findById(
    req.user.id
  );

  res.status(200).json({
    id,
    name,
    email,
    createdAt,
    updatedAt,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  const jwtCookie = req.cookies.jwt;

  if (!jwtCookie) {
    res.status(400).json({ message: "user not logged in" });
    throw new Error("user not logged in");
  }

  res.clearCookie("jwt").json({ message: "logged out successfully" });
});

const generateJwtToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

module.exports = {
  getUser,
  createUser,
  loginUser,
  logoutUser,
};
