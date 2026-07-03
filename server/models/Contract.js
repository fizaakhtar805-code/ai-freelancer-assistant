const mongoose = require("mongoose")

const contractSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: { type: String, default: "" },
    freelancerName: { type: String, default: "" },
    projectScope: { type: String, default: "" },
    timeline: { type: String, default: "" },
    paymentTerms: { type: String, default: "" },
    termsAndConditions: { type: String, default: "" },
    generatedContract: { type: String, default: "" },
  },
  { timestamps: true }
)

const Contract = mongoose.model("Contract", contractSchema)

module.exports = Contract