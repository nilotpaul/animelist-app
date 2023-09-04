const express = require("express");
const {
  getUser,
  createUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
const protectRoutes = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/me", protectRoutes, getUser);
router.post("/logout", logoutUser);

module.exports = router;
