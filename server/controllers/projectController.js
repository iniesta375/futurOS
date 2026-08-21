const mongoose = require("mongoose");

const Project = require("../models/Project");
const Activity = require("../models/Activity");

const uploadToCloudinary = require("../utils/uploadToCloudinary");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary");

// Get all projects
const getProjects = async (req, res) => {
  console.log(
    "GET PROJECT ROUTE HIT",
    req.params.id,
  );

  try {
    const projects = await Project.find().sort({
      createdAt: -1,
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get one project
const getProject = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id,
      )
    ) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(
      req.params.id,
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create project
const createProject = async (req, res) => {
  try {
    let image = "";
    let imagePublicId = "";

    if (req.file) {
      const uploadedImage =
        await uploadToCloudinary(
          req.file.buffer,
        );

      image = uploadedImage.secure_url;
      imagePublicId =
        uploadedImage.public_id;
    }

    const technologies = req.body.technologies
      ? JSON.parse(req.body.technologies)
      : [];

    const project = await Project.create({
      ...req.body,
      technologies,
      links: {
        github:
          req.body["links[github]"] || "",
        live:
          req.body["links[live]"] || "",
      },
      image,
      imagePublicId,
    });

    await Activity.create({
      type: "project",
      action: "Project created",
      title: project.title,
      entityId: project._id.toString(),
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id,
      )
    ) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(
      req.params.id,
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    let image = project.image;
    let imagePublicId =
      project.imagePublicId;

    if (
      req.body.removeImage === "true" &&
      project.imagePublicId
    ) {
      await deleteFromCloudinary(
        project.imagePublicId,
      );

      image = "";
      imagePublicId = "";
    } else if (req.file) {
      if (project.imagePublicId) {
        await deleteFromCloudinary(
          project.imagePublicId,
        );
      }

      const uploadedImage =
        await uploadToCloudinary(
          req.file.buffer,
        );

      image = uploadedImage.secure_url;
      imagePublicId =
        uploadedImage.public_id;
    }

    const technologies = req.body.technologies
      ? JSON.parse(req.body.technologies)
      : [];

    const updatedProject =
      await Project.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          links: {
            github:
              req.body["links[github]"] ||
              "",
            live:
              req.body["links[live]"] ||
              "",
          },
          technologies,
          image,
          imagePublicId,
        },
        {
          new: true,
          runValidators: true,
        },
      );

    await Activity.create({
      type: "project",
      action: "Project updated",
      title: updatedProject.title,
      entityId: updatedProject._id.toString(),
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id,
      )
    ) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(
      req.params.id,
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const projectTitle = project.title;
    const projectId = project._id.toString();

    if (project.imagePublicId) {
      await deleteFromCloudinary(
        project.imagePublicId,
      );
    }

    await project.deleteOne();

    await Activity.create({
      type: "project",
      action: "Project deleted",
      title: projectTitle,
      entityId: projectId,
    });

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Bulk project actions
const bulkProjectAction = async (
  req,
  res,
) => {
  try {
    const { ids, action } = req.body;

    if (
      !Array.isArray(ids) ||
      ids.length === 0
    ) {
      return res.status(400).json({
        message: "No projects selected.",
      });
    }

    const validActions = [
      "feature",
      "unfeature",
      "archive",
      "delete",
    ];

    if (!validActions.includes(action)) {
      return res.status(400).json({
        message: "Invalid action.",
      });
    }

    const projects = await Project.find({
      _id: { $in: ids },
    });

    switch (action) {
      case "feature":
        await Project.updateMany(
          { _id: { $in: ids } },
          { featured: true },
        );

        for (const project of projects) {
          await Activity.create({
            type: "project",
            action: "Project featured",
            title: project.title,
            entityId: project._id.toString(),
          });
        }

        break;

      case "unfeature":
        await Project.updateMany(
          { _id: { $in: ids } },
          { featured: false },
        );

        for (const project of projects) {
          await Activity.create({
            type: "project",
            action: "Project unfeatured",
            title: project.title,
            entityId: project._id.toString(),
          });
        }

        break;

      case "archive":
        await Project.updateMany(
          { _id: { $in: ids } },
          { status: "Archived" },
        );

        for (const project of projects) {
          await Activity.create({
            type: "project",
            action: "Project archived",
            title: project.title,
            entityId: project._id.toString(),
          });
        }

        break;

      case "delete": {
        for (const project of projects) {
          if (project.imagePublicId) {
            await deleteFromCloudinary(
              project.imagePublicId,
            );
          }

          await Activity.create({
            type: "project",
            action: "Project deleted",
            title: project.title,
            entityId: project._id.toString(),
          });
        }

        await Project.deleteMany({
          _id: { $in: ids },
        });

        break;
      }
    }

    res.status(200).json({
      message: `${ids.length} project(s) updated successfully.`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  bulkProjectAction,
};