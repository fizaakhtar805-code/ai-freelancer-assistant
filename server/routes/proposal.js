const express = require("express")
const PDFDocument = require("pdfkit")
const Proposal = require("../models/Proposal")
const generateAIContent = require("../config/gemini")
const protect = require("../middleware/auth")

const router = express.Router()

// GENERATE a proposal with AI (no login needed just to generate)
router.post("/generate", async (req, res) => {
  try {
    const { clientName, projectTitle, projectDescription, skills, budget, timeline, tone } = req.body

    if (!projectTitle || !projectDescription) {
      return res.status(400).json({ message: "Project title and description are required" })
    }

    const prompt = `
Write a professional freelance project proposal based on these details:

Client Name: ${clientName || "the client"}
Project Title: ${projectTitle}
Project Description: ${projectDescription}
My Skills: ${skills || "relevant skills"}
Budget: ${budget || "to be discussed"}
Timeline: ${timeline || "to be discussed"}
Tone: ${tone || "Professional"}

Write a well-structured, persuasive proposal addressed to the client. Include a greeting, an understanding of their needs, my proposed approach, why I'm a good fit, the timeline and budget, and a professional closing. Keep it concise and ready to send.
`

    const generatedContent = await generateAIContent(prompt)

    res.status(200).json({ generatedContent })
  } catch (error) {
    console.log("Generate proposal error:", error)
    res.status(500).json({ message: "Failed to generate proposal", error: error.message })
  }
})

// SAVE a proposal (login required)
router.post("/save", protect, async (req, res) => {
  try {
    const { clientName, projectTitle, projectDescription, skills, budget, timeline, tone, generatedContent } = req.body

    const proposal = new Proposal({
      user: req.userId,
      clientName,
      projectTitle,
      projectDescription,
      skills,
      budget,
      timeline,
      tone,
      generatedContent,
    })

    await proposal.save()

    res.status(201).json({ message: "Proposal saved successfully!" })
  } catch (error) {
    console.log("Save proposal error:", error)
    res.status(500).json({ message: "Failed to save proposal" })
  }
})

// GET all proposals for the logged-in user (login required)
router.get("/", protect, async (req, res) => {
  try {
    const proposals = await Proposal.find({ user: req.userId }).sort({ createdAt: -1 })
    res.status(200).json(proposals)
  } catch (error) {
    console.log("Get proposals error:", error)
    res.status(500).json({ message: "Failed to fetch proposals" })
  }
})

// EXPORT a proposal as PDF (login required)
router.get("/:id/pdf", protect, async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ _id: req.params.id, user: req.userId })

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" })
    }

    const doc = new PDFDocument({ margin: 50 })

    // tell the browser this is a downloadable PDF file
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${(proposal.projectTitle || "proposal").replace(/[^a-z0-9]/gi, "_")}.pdf"`
    )

    // pipe the generated PDF directly into the response
    doc.pipe(res)

    doc.fontSize(20).text(proposal.projectTitle || "Proposal", { underline: true })
    doc.moveDown()

    doc.fontSize(11).fillColor("#555")
    if (proposal.clientName) doc.text(`Client: ${proposal.clientName}`)
    if (proposal.budget) doc.text(`Budget: ${proposal.budget}`)
    if (proposal.timeline) doc.text(`Timeline: ${proposal.timeline}`)
    doc.text(`Date: ${new Date(proposal.createdAt).toLocaleDateString()}`)
    doc.moveDown()

    doc.fillColor("#000").fontSize(12).text(proposal.generatedContent, {
      align: "left",
      lineGap: 4,
    })

    doc.end()
  } catch (error) {
    console.log("Export PDF error:", error)
    res.status(500).json({ message: "Failed to export PDF" })
  }
})

// UPDATE a proposal (login required)
router.put("/:id", protect, async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ _id: req.params.id, user: req.userId })

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" })
    }

    const { clientName, projectTitle, projectDescription, skills, budget, timeline, tone, generatedContent } = req.body

    proposal.clientName = clientName
    proposal.projectTitle = projectTitle
    proposal.projectDescription = projectDescription
    proposal.skills = skills
    proposal.budget = budget
    proposal.timeline = timeline
    proposal.tone = tone
    proposal.generatedContent = generatedContent

    await proposal.save()

    res.status(200).json({ message: "Proposal updated successfully!" })
  } catch (error) {
    console.log("Update proposal error:", error)
    res.status(500).json({ message: "Failed to update proposal" })
  }
})

// DELETE a proposal (login required)
router.delete("/:id", protect, async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ _id: req.params.id, user: req.userId })

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" })
    }

    await proposal.deleteOne()
    res.status(200).json({ message: "Proposal deleted" })
  } catch (error) {
    console.log("Delete proposal error:", error)
    res.status(500).json({ message: "Failed to delete proposal" })
  }
})

module.exports = router