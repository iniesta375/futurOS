const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    employmentType: {
      type: String,
      enum: [
        "Internship",
        "Full-time",
        "Part-time",
        "Contract",
        "Freelance",
        "Volunteer",
        "Other",
      ],
      default: "Full-time",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null,
    },

    current: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    technologies: {
      type: [String],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Active", "Archived"],
      default: "Active",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Experience", experienceSchema);