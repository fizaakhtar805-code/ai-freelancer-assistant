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
    await newUser.save()

    const newProfile = new Profile({
      user: newUser._id,
    })
    await newProfile.save()

    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`

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

    res.status(201).json({ message: "Account created! Please check your email to verify your account." })
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

module.exports = router