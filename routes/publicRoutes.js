const express = require("express");
const {
  getAllUser,
  getAnilistById,
} = require("../controllers/publicController");

const router = express.Router();

router.get("/users", getAllUser);
router.get("/animelist/:id", getAnilistById);

module.exports = router;
