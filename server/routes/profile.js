const express = require("express")
const bcrypt = require("bcryptjs")
const Profile = require("../models/Profile")
const User = require("../models/User")
const protect = require("../middleware/auth")

const router = express.Router()

// GET current user's profile (login required)
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email")
    let profile = await Profile.findOne({ user: req.userId })

    if (!profile) {
      profile = new Profile({ user: req.userId })
      await profile.save()
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      bio: profile.bio,
      jobTitle: profile.jobTitle,
      profilePicture: profile.profilePicture,
      aiCredits: profile.aiCredits,
    })
  } catch (error) {
    console.log("Get profile error:", error)
    res.status(500).json({ message: "Failed to fetch profile" })
  }
})

// UPDATE profile details (login required)
router.put("/", protect, async (req, res) => {
  try {
    const { name, bio, jobTitle, profilePicture } = req.body

    let profile = await Profile.findOne({ user: req.userId })
    if (!profile) {
      profile = new Profile({ user: req.userId })
    }

    if (bio !== undefined) profile.bio = bio
    if (jobTitle !== undefined) profile.jobTitle = jobTitle
    if (profilePicture !== undefined) profile.profilePicture = profilePicture
    await profile.save()

    if (name) {
      await User.findByIdAndUpdate(req.userId, { name })
    }

    res.status(200).json({ message: "Profile updated successfully!" })
  } catch (error) {
    console.log("Update profile error:", error)
    res.status(500).json({ message: "Failed to update profile" })
  }
})

// CHANGE password (login required)
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" })
    }

    const user = await User.findById(req.userId)
    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    res.status(200).json({ message: "Password changed successfully!" })
  } catch (error) {
    console.log("Change password error:", error)
    res.status(500).json({ message: "Failed to change password" })
  }
})

module.exports = router