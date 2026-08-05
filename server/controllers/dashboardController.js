const Project = require("../models/Project");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProjects,
      featuredProjects,
      inProgressProjects,
      completedProjects,
      latestProject,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Project.countDocuments({ status: "In Progress" }),
      Project.countDocuments({ status: "Completed" }),
      Project.findOne().sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      totalProjects,
      featuredProjects,
      inProgressProjects,
      completedProjects,
      latestProject,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};