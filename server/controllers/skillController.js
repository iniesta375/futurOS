const mongoose = require("mongoose");
const Skill = require("../models/Skill");

const uploadToCloudinary = require("../utils/uploadToCloudinary");
const deleteFromCloudinary = require("../utils/deleteFromCloudinary");

// Get all skills
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({
      createdAt: -1,
    });

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get one skill
const getSkill = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid skill ID",
      });
    }

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create skill
const createSkill = async (req, res) => {
  try {
    let icon = "";
    let iconPublicId = "";

    if (req.file) {
      const uploadedIcon = await uploadToCloudinary(req.file.buffer);

      icon = uploadedIcon.secure_url;
      iconPublicId = uploadedIcon.public_id;
    }

    const skill = await Skill.create({
      ...req.body,
      icon,
      iconPublicId,
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid skill ID",
      });
    }

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    let icon = skill.icon;
    let iconPublicId = skill.iconPublicId;

    if (req.body.removeIcon === "true" && skill.iconPublicId) {
      await deleteFromCloudinary(skill.iconPublicId);

      icon = "";
      iconPublicId = "";
    } else if (req.file) {
      if (skill.iconPublicId) {
        await deleteFromCloudinary(skill.iconPublicId);
      }

      const uploadedIcon = await uploadToCloudinary(req.file.buffer);

      icon = uploadedIcon.secure_url;
      iconPublicId = uploadedIcon.public_id;
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        icon,
        iconPublicId,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedSkill);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid skill ID",
      });
    }

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        message: "Skill not found",
      });
    }

    if (skill.iconPublicId) {
      await deleteFromCloudinary(skill.iconPublicId);
    }

    await skill.deleteOne();

    res.status(200).json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
};