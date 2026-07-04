const express = require("express")
const ClientReply = require("../models/ClientReply")
const generateAIContent = require("../config/gemini")
const protect = require("../middleware/auth")

const router = express.Router()

// GENERATE a client reply with AI (no login needed just to generate)
router.post("/generate", async (req, res) => {
  try {
    const { clientMessage, tone } = req.body

    if (!clientMessage) {
      return res.status(400).json({ message: "Client message is required" })
    }

    if (clientMessage.length > 2000) {
      return res.status(400).json({ message: "Client message is too long (max 2000 characters)" })
    }

    const prompt = `
A client sent this message to a freelancer:

"${clientMessage}"

Write a professional, well-structured reply from the freelancer to the client, in a ${tone || "Professional"} tone. Address the client's message directly, be clear and courteous, and keep it concise and ready to send.
`

    const generatedReply = await generateAIContent(prompt)

    res.status(200).json({ generatedReply })
  } catch (error) {
    console.log("Generate client reply error:", error)
    res.status(500).json({ message: "Failed to generate reply", error: error.message })
  }
})

// SAVE a client reply (login required)
router.post("/save", protect, async (req, res) => {
  try {
    const { clientMessage, tone, generatedReply } = req.body

    const reply = new ClientReply({
      user: req.userId,
      clientMessage,
      tone,
      generatedReply,
    })

    await reply.save()

    res.status(201).json({ message: "Reply saved successfully!" })
  } catch (error) {
    console.log("Save client reply error:", error)
    res.status(500).json({ message: "Failed to save reply" })
  }
})

// GET all client replies for the logged-in user (login required)
router.get("/", protect, async (req, res) => {
  try {
    const replies = await ClientReply.find({ user: req.userId }).sort({ createdAt: -1 })
    res.status(200).json(replies)
  } catch (error) {
    console.log("Get client replies error:", error)
    res.status(500).json({ message: "Failed to fetch replies" })
  }
})

// DELETE a client reply (login required)
router.delete("/:id", protect, async (req, res) => {
  try {
    const reply = await ClientReply.findOne({ _id: req.params.id, user: req.userId })
    if (!reply) return res.status(404).json({ message: "Reply not found" })
    await reply.deleteOne()
    res.status(200).json({ message: "Reply deleted" })
  } catch (error) {
    console.log("Delete client reply error:", error)
    res.status(500).json({ message: "Failed to delete reply" })
  }
})

module.exports = router