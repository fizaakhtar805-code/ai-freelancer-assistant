const mongoose = require("mongoose")

const gigDescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceCategory: { type: String, default: "" },
    skills: { type: String, default: "" },
    experienceLevel: { type: String, default: "" },
    deliveryTime: { type: String, default: "" },
    features: { type: String, default: "" },
    revisions: { type: String, default: "" },
    generatedDescription: { type: String, default: "" },
    seoKeywords: { type: String, default: "" },
    faqSuggestions: { type: String, default: "" },
  },
  { timestamps: true }
)

const GigDescription = mongoose.model("GigDescription", gigDescriptionSchema)

module.exports = GigDescription