const mongoose = require("mongoose")

const pricingHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hourlyRate: { type: Number, default: 0 },
    estimatedHours: { type: Number, default: 0 },
    projectComplexity: { type: String, default: "Medium" },
    urgency: { type: String, default: "Standard" },
    additionalCharges: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    suggestedPrice: { type: Number, default: 0 },
    recommendedDeliveryTime: { type: String, default: "" },
    marketAnalysis: { type: String, default: "" },
    serviceImprovementTips: { type: String, default: "" },
  },
  { timestamps: true }
)

const PricingHistory = mongoose.model("PricingHistory", pricingHistorySchema)

module.exports = PricingHistory