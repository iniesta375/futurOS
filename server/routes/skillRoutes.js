const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");

const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

// Public Routes
router.get("/", getSkills);
router.get("/:id", getSkill);

// Protected Routes
router.post("/", protect, upload.single("icon"), createSkill);
router.put("/:id", protect, upload.single("icon"), updateSkill);
router.delete("/:id", protect, deleteSkill);

module.exports = router;