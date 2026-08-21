const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["project", "skill"],
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    entityId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);