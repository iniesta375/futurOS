const mongoose = require("mongoose");

const Skill = require("../models/Skill");
const Activity = require("../models/Activity");

const uploadToCloudinary = require("../utils/uploadToCloudinary");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary");

const getSkills = async (req, res) => {
  try {
    const archived =
      req.query.archived === "true";

    const skills = await Skill.find({
      archived,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSkill = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid skill ID.",
      });
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found.",
      });
    }

    res.status(200).json(skill);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to fetch skill.",
    });
  }
};

// Create Skill
const createSkill = async (req, res) => {
  try {
    let icon = "";
    let iconPublicId = "";

    if (req.file) {
      const uploaded =
        await uploadToCloudinary(
          req.file.buffer,
        );

      icon = uploaded.secure_url;
      iconPublicId = uploaded.public_id;
    }

    const existing = await Skill.findOne({
      name: req.body.name.trim(),
    });

    if (existing) {
      return res.status(409).json({
        message: "Skill already exists.",
      });
    }

    const skill = await Skill.create({
      name: req.body.name,
      category: req.body.category,
      proficiency: Number(
        req.body.proficiency,
      ),
      featured:
        req.body.featured === "true",
      icon,
      iconPublicId,
    });

    await Activity.create({
      type: "skill",
      action: "Skill added",
      title: skill.name,
      entityId: skill._id.toString(),
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to create skill.",
    });
  }
};

// Update Skill
const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid skill ID.",
      });
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found.",
      });
    }

    let icon = skill.icon;
    let iconPublicId =
      skill.iconPublicId;

    if (
      req.body.removeIcon === "true" &&
      skill.iconPublicId
    ) {
      await deleteFromCloudinary(
        skill.iconPublicId,
      );

      icon = "";
      iconPublicId = "";
    }

    if (req.file) {
      if (skill.iconPublicId) {
        await deleteFromCloudinary(
          skill.iconPublicId,
        );
      }

      const uploaded =
        await uploadToCloudinary(
          req.file.buffer,
        );

      icon = uploaded.secure_url;
      iconPublicId = uploaded.public_id;
    }

    skill.name = req.body.name;
    skill.category = req.body.category;
    skill.proficiency = Number(
      req.body.proficiency,
    );
    skill.featured =
      req.body.featured === "true";

    skill.icon = icon;
    skill.iconPublicId = iconPublicId;

    await skill.save();

    await Activity.create({
      type: "skill",
      action: "Skill updated",
      title: skill.name,
      entityId: skill._id.toString(),
    });

    res.json(skill);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update skill.",
    });
  }
};

// Archive Skill
const archiveSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(
      req.params.id,
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found.",
      });
    }

    skill.archived = true;

    await skill.save();

    await Activity.create({
      type: "skill",
      action: "Skill archived",
      title: skill.name,
      entityId: skill._id.toString(),
    });

    res.json({
      message:
        "Skill archived successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Archived Skills
const getArchivedSkills = async (
  req,
  res,
) => {
  try {
    const skills = await Skill.find({
      archived: true,
    }).sort({
      createdAt: -1,
    });

    res.json(skills);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Restore Skill
const restoreSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(
      req.params.id,
    );

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found.",
      });
    }

    skill.archived = false;

    await skill.save();

    await Activity.create({
      type: "skill",
      action: "Skill restored",
      title: skill.name,
      entityId: skill._id.toString(),
    });

    res.json({
      message:
        "Skill restored successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Skill
const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid skill ID.",
      });
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found.",
      });
    }

    const skillName = skill.name;
    const skillId = skill._id.toString();

    if (skill.iconPublicId) {
      await deleteFromCloudinary(
        skill.iconPublicId,
      );
    }

    await skill.deleteOne();

    await Activity.create({
      type: "skill",
      action: "Skill deleted",
      title: skillName,
      entityId: skillId,
    });

    res.json({
      message:
        "Skill deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to delete skill.",
    });
  }
};

module.exports = {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  archiveSkill,
  restoreSkill,
  getArchivedSkills,
};