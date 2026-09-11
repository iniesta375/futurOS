const express = require("express");

const {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  archiveExperience,
  restoreExperience,
} = require("../controllers/experienceController");

const router = express.Router();

// Get all experiences
router.get("/", getExperiences);

// Get one experience
router.get("/:id", getExperience);

// Create experience
router.post("/", createExperience);

// Update experience
router.put("/:id", updateExperience);

// Delete experience
router.delete("/:id", deleteExperience);

// Archive experience
router.patch("/:id/archive", archiveExperience);

// Restore experience
router.patch("/:id/restore", restoreExperience);

module.exports = router;