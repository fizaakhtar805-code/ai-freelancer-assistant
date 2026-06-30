const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: "" },
    resetToken: { type: String, default: "" },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)

module.exports = User