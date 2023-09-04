const express = require("express");
const {
  getData,
  createData,
  deleteData,
  editData,
} = require("../controllers/anilistController");
const protectRoutes = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protectRoutes, getData);
router.post("/", protectRoutes, createData);
router.delete("/:id", protectRoutes, deleteData);
router.put("/:id", protectRoutes, editData);

module.exports = router;
