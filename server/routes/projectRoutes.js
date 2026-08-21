const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");

const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  bulkProjectAction,
} = require("../controllers/projectController");

// Public Routes
router.get("/", getProjects);
router.get("/:id", getProject);

// Protected Routes
router.post("/", protect, upload.single("image"), createProject);

router.post("/bulk-action", protect, bulkProjectAction);

router.put("/:id", protect, upload.single("image"), updateProject);

router.delete("/:id", protect, deleteProject);

module.exports = router;