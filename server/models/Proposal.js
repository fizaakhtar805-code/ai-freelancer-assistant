const mongoose = require("mongoose")

const proposalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: { type: String, default: "" },
    projectTitle: { type: String, default: "" },
    projectDescription: { type: String, default: "" },
    skills: { type: String, default: "" },
    budget: { type: String, default: "" },
    timeline: { type: String, default: "" },
    tone: { type: String, default: "Professional" },
    generatedContent: { type: String, default: "" },
  },
  { timestamps: true }
)

const Proposal = mongoose.model("Proposal", proposalSchema)

module.exports = Proposal