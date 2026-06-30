const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    aiCredits: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
)

const Profile = mongoose.model("Profile", profileSchema)

module.exports = Profile