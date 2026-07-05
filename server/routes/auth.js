const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const User = require("../models/User")
const Profile = require("../models/Profile")
const sendEmail = require("../utils/sendEmail")

const router = express.Router()

// SIGNUP route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const verificationToken = crypto.randomBytes(32).toString("hex")

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    })

    const newProfile = new Profile({
      user: newUser._id,
    })

    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`

    let emailSent = true
    try {
      await sendEmail(
        email,
        "Verify your email - AI Freelancer Assistant",
        `
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for signing up. Please verify your email by clicking the button below:</p>
          <a href="${verifyLink}" style="display:inline-block;padding:12px 24px;background:#4361ee;color:#fff;text-decoration:none;border-radius:8px;">Verify Email</a>
          <p>Or copy this link into your browser:</p>
          <p>${verifyLink}</p>
        `
      )
    } catch (emailError) {
      console.log("Email sending failed, auto-verifying account instead:", emailError.message)
      emailSent = false
      newUser.isVerified = true
    }

    await newUser.save()
    await newProfile.save()

    if (emailSent) {
      res.status(201).json({ message: "Account created! Please check your email to verify your account." })
    } else {
      res.status(201).json({ message: "Account created! You can log in now." })
    }
  } catch (error) {
    console.log("Signup error:", error)
    res.status(500).json({ message: "Something went wrong" })
  }
})

// LOGIN route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email before logging in." })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.log("Login error:", error)
    res.status(500).json({ message: "Something went wrong" })
  }
})

// VERIFY EMAIL route
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query

    const user = await User.findOne({ verificationToken: token })
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification link" })
    }

    user.isVerified = true
    user.verificationToken = ""
    await user.save()

    res.status(200).json({ message: "Email verified successfully! You can now log in." })
  } catch (error) {
    console.log("Verify error:", error)
    res.status(500).json({ message: "Something went wrong" })
  }
})

// FORGOT PASSWORD route - sends reset email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(200).json({ message: "If that email exists, a reset link has been sent." })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetToken = resetToken
    user.resetTokenExpiry = Date.now() + 3600000
    await user.save()

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

    try {
      await sendEmail(
        email,
        "Reset your password - AI Freelancer Assistant",
        `
          <h2>Password Reset Request</h2>
          <p>You asked to reset your password. Click the button below to set a new one:</p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#4361ee;color:#fff;text-decoration:none;border-radius:8px;">Reset Password</a>
          <p>Or copy this link into your browser:</p>
          <p>${resetLink}</p>
          <p>This link will expire in 1 hour. If you didn't request this, you can ignore this email.</p>
        `
      )
    } catch (emailError) {
      console.log("Reset email failed to send:", emailError.message)
    }

    res.status(200).json({ message: "If that email exists, a reset link has been sent." })
  } catch (error) {
    console.log("Forgot password error:", error)
    res.status(500).json({ message: "Something went wrong" })
  }
})

// RESET PASSWORD route - saves the new password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body

    if (!password) {
      return res.status(400).json({ message: "Please enter a new password" })
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link" })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.resetToken = ""
    user.resetTokenExpiry = undefined
    await user.save()

    res.status(200).json({ message: "Password reset successfully! You can now log in." })
  } catch (error) {
    console.log("Reset password error:", error)
    res.status(500).json({ message: "Something went wrong" })
  }
})

module.exports = router