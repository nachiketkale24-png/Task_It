const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["Owner", "TeamLead", "Intern", "Member"],
      default: "Intern",
    },
  },
  {
    _id: false,
  }
);

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [memberSchema],
  },
  {
    timestamps: true,
  }
);

teamSchema.pre("validate", function normalizeTeamRoles() {
  if (Array.isArray(this.members)) {
    this.members.forEach((member) => {
      if (member.role === "Member") {
        member.role = "Intern";
      }
    });
  }
});
module.exports = mongoose.model("Team", teamSchema);
