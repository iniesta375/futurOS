const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
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
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    accent: {
      type: String,
      default: "#6366f1",
    },

    gradient: {
      type: String,
      default:
        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    },

    role: {
      type: String,
      default: "Full Stack Developer",
    },

    year: {
      type: String,
      default: new Date().getFullYear().toString(),
    },

    technologies: [
      {
        type: String,
      },
    ],

    highlights: [
      {
        type: String,
      },
    ],

    links: {
      github: {
        type: String,
        default: "",
      },

      live: {
        type: String,
        default: "",
      },
    },

    stats: {
      stars: {
        type: Number,
        default: 0,
      },

      commits: {
        type: Number,
        default: 0,
      },

      forks: {
        type: Number,
        default: 0,
      },
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