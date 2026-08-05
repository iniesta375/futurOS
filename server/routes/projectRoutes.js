const express = require("express");
console.log("PROJECT ROUTES FILE LOADED");
const router = express.Router();

const upload = require("../middleware/upload");



const protect = require("../middleware/authMiddleware");

const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.get("/", getProjects);
router.get("/:id", getProject);

router.post("/", protect,  upload.single("image"), createProject);
router.put("/:id", protect, upload.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);



module.exports = router;