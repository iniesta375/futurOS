const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    subtitle: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "portfolio",
    },

    image: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    liveDemo: {
      type: String,
      default: "",
    },

    technologies: [
      {
        type: String,
      },
    ],

    stars: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Completed",
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);