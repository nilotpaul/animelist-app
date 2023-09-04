const express = require("express");
const {
  getReviews,
  postReviews,
  deleteReviews,
  editReviews,
} = require("../controllers/reviewController");
const protectRoutes = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getReviews);
router.post("/", protectRoutes, postReviews);
router.delete("/:id", protectRoutes, deleteReviews);
router.put("/:id", protectRoutes, editReviews);

module.exports = router;
