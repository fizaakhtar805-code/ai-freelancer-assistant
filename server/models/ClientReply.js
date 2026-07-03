const mongoose = require("mongoose")

const clientReplySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientMessage: { type: String, default: "" },
    tone: { type: String, default: "Professional" },
    generatedReply: { type: String, default: "" },
  },
  { timestamps: true }
)

const ClientReply = mongoose.model("ClientReply", clientReplySchema)

module.exports = ClientReply