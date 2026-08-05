const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Frontend",
        "Backend",
        "Database",
        "DevOps",
        "Mobile",
        "Tools",
        "Design",
        "Other",
      ],
      default: "Frontend",
    },

    proficiency: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 80,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    icon: {
      type: String,
      default: "",
    },

    iconPublicId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Skill", skillSchema);