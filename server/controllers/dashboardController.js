const Project = require("../models/Project");
const Skill = require("../models/Skill");
const Activity = require("../models/Activity");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProjects,
      featuredProjects,
      inProgressProjects,
      completedProjects,
      latestProject,
      recentActivity,
    ] = await Promise.all([
      Project.countDocuments(),

      Project.countDocuments({
        featured: true,
      }),

      Project.countDocuments({
        status: "In Progress",
      }),

      Project.countDocuments({
        status: "Completed",
      }),

      Project.findOne().sort({
        createdAt: -1,
      }),

      Activity.find()
        .sort({
          createdAt: -1,
        })
        .limit(6),
    ]);

    res.status(200).json({
      totalProjects,
      featuredProjects,
      inProgressProjects,
      completedProjects,
      latestProject,
      recentActivity: recentActivity.map((activity) => ({
        id: activity._id,
        type: activity.type,
        title: activity.title,
        action: activity.action,
        date: activity.createdAt,
      })),
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