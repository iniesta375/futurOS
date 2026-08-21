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
  archiveSkill,
  restoreSkill,
  getArchivedSkills,
} = require("../controllers/skillController");

router.get("/", getSkills);
router.get("/archived", getArchivedSkills);
router.get("/:id", getSkill);

router.post("/", protect, upload.single("icon"), createSkill);

router.put("/:id", protect, upload.single("icon"), updateSkill);

router.patch("/:id/archive", protect, archiveSkill);

// router.get("/archived", getArchivedSkills);

router.patch("/:id/restore", protect, restoreSkill);

router.delete("/:id", protect, deleteSkill);

module.exports = router;
