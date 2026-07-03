const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: { type: String, default: "" },
    clientEmail: { type: String, default: "" },
    projectDetails: { type: String, default: "" },
    services: { type: String, default: "" },
    amount: { type: Number, default: 0 },
    dueDate: { type: String, default: "" },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Invoice = mongoose.model("Invoice", invoiceSchema)

module.exports = Invoice