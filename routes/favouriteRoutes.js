const express = require("express");
const protectRoutes = require("../middlewares/authMiddleware");
const {
  getFavourite,
  createFavourite,
  delFavourite,
} = require("../controllers/favouriteController");

const router = express.Router();

router.get("/", protectRoutes, getFavourite);
router.post("/", protectRoutes, createFavourite);
router.delete("/:id", protectRoutes, delFavourite);

module.exports = router;
