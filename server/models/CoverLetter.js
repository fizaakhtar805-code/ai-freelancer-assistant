const mongoose = require("mongoose")

const coverLetterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobTitle: { type: String, default: "" },
    companyName: { type: String, default: "" },
    experience: { type: String, default: "" },
    skills: { type: String, default: "" },
    portfolioUrl: { type: String, default: "" },
    tone: { type: String, default: "Professional" },
    generatedContent: { type: String, default: "" },
  },
  { timestamps: true }
)

const CoverLetter = mongoose.model("CoverLetter", coverLetterSchema)

module.exports = CoverLetter