const mongoose = require("mongoose");
const Experience = require("../models/Experience");

// Get all experiences
const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({
      order: 1,
      startDate: -1,
    });

    res.status(200).json(experiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get one experience
const getExperience = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid experience ID" });
    }

    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    res.status(200).json(experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Create experience
const createExperience = async (req, res) => {
  try {
    const {
      company,
      role,
      employmentType,
      location,
      startDate,
      endDate,
      current,
      description,
      technologies,
      featured,
      status,
      order,
    } = req.body;

    const experience = await Experience.create({
      company,
      role,
      employmentType,
      location,
      startDate,
      endDate: current ? null : endDate || null,
      current: Boolean(current),
      description,
      technologies: Array.isArray(technologies) ? technologies : [],
      featured: Boolean(featured),
      status,
      order,
    });

    res.status(201).json(experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update experience
const updateExperience = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid experience ID" });
    }

    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const {
      company,
      role,
      employmentType,
      location,
      startDate,
      endDate,
      current,
      description,
      technologies,
      featured,
      status,
      order,
    } = req.body;

    experience.company = company;
    experience.role = role;
    experience.employmentType = employmentType;
    experience.location = location;
    experience.startDate = startDate;
    experience.endDate = current ? null : endDate || null;
    experience.current = Boolean(current);
    experience.description = description;
    experience.technologies = Array.isArray(technologies)
      ? technologies
      : [];
    experience.featured = Boolean(featured);
    experience.status = status;
    experience.order = order;

    const updatedExperience = await experience.save();

    res.status(200).json(updatedExperience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete experience
const deleteExperience = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid experience ID" });
    }

    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    await experience.deleteOne();

    res.status(200).json({
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Archive experience
const archiveExperience = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid experience ID" });
    }

    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    experience.status = "Archived";

    const updatedExperience = await experience.save();

    res.status(200).json(updatedExperience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Restore experience
const restoreExperience = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid experience ID" });
    }

    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    experience.status = "Active";

    const updatedExperience = await experience.save();

    res.status(200).json(updatedExperience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  archiveExperience,
  restoreExperience,
};