const express = require("express")
const PDFDocument = require("pdfkit")
const CoverLetter = require("../models/CoverLetter")
const generateAIContent = require("../config/gemini")
const protect = require("../middleware/auth")

const router = express.Router()

// GENERATE a cover letter with AI (no login needed just to generate)
router.post("/generate", async (req, res) => {
  try {
    const { jobTitle, companyName, experience, skills, portfolioUrl, tone } = req.body

    if (!jobTitle || !companyName) {
      return res.status(400).json({ message: "Job title and company name are required" })
    }

    const prompt = `
Write a professional cover letter based on these details:

Job Title: ${jobTitle}
Company Name: ${companyName}
My Experience: ${experience || "relevant experience"}
My Skills: ${skills || "relevant skills"}
Portfolio URL: ${portfolioUrl || "not provided"}
Tone: ${tone || "Professional"}

Write a well-structured, persuasive cover letter addressed to the hiring team. Include a greeting, an introduction expressing interest in the role, a summary of relevant experience and skills, why I'm a strong fit for this company, a mention of my portfolio if provided, and a professional closing. Keep it concise and ready to send.
`

    const generatedContent = await generateAIContent(prompt)

    res.status(200).json({ generatedContent })
  } catch (error) {
    console.log("Generate cover letter error:", error)
    res.status(500).json({ message: "Failed to generate cover letter", error: error.message })
  }
})

// SAVE a cover letter (login required)
router.post("/save", protect, async (req, res) => {
  try {
    const { jobTitle, companyName, experience, skills, portfolioUrl, tone, generatedContent } = req.body

    const coverLetter = new CoverLetter({
      user: req.userId,
      jobTitle,
      companyName,
      experience,
      skills,
      portfolioUrl,
      tone,
      generatedContent,
    })

    await coverLetter.save()

    res.status(201).json({ message: "Cover letter saved successfully!" })
  } catch (error) {
    console.log("Save cover letter error:", error)
    res.status(500).json({ message: "Failed to save cover letter" })
  }
})

// GET all cover letters for the logged-in user (login required)
router.get("/", protect, async (req, res) => {
  try {
    const coverLetters = await CoverLetter.find({ user: req.userId }).sort({ createdAt: -1 })
    res.status(200).json(coverLetters)
  } catch (error) {
    console.log("Get cover letters error:", error)
    res.status(500).json({ message: "Failed to fetch cover letters" })
  }
})

// EXPORT a cover letter as PDF (login required)
router.get("/:id/pdf", protect, async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findOne({ _id: req.params.id, user: req.userId })

    if (!coverLetter) {
      return res.status(404).json({ message: "Cover letter not found" })
    }

    const doc = new PDFDocument({ margin: 50 })

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${(coverLetter.jobTitle || "cover_letter").replace(/[^a-z0-9]/gi, "_")}.pdf"`
    )

    doc.pipe(res)

    doc.fontSize(20).text(coverLetter.jobTitle || "Cover Letter", { underline: true })
    doc.moveDown()

    doc.fontSize(11).fillColor("#555")
    if (coverLetter.companyName) doc.text(`Company: ${coverLetter.companyName}`)
    if (coverLetter.portfolioUrl) doc.text(`Portfolio: ${coverLetter.portfolioUrl}`)
    doc.text(`Date: ${new Date(coverLetter.createdAt).toLocaleDateString()}`)
    doc.moveDown()

    doc.fillColor("#000").fontSize(12).text(coverLetter.generatedContent, {
      align: "left",
      lineGap: 4,
    })

    doc.end()
  } catch (error) {
    console.log("Export PDF error:", error)
    res.status(500).json({ message: "Failed to export PDF" })
  }
})

// UPDATE a cover letter (login required)
router.put("/:id", protect, async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findOne({ _id: req.params.id, user: req.userId })

    if (!coverLetter) {
      return res.status(404).json({ message: "Cover letter not found" })
    }

    const { jobTitle, companyName, experience, skills, portfolioUrl, tone, generatedContent } = req.body

    coverLetter.jobTitle = jobTitle
    coverLetter.companyName = companyName
    coverLetter.experience = experience
    coverLetter.skills = skills
    coverLetter.portfolioUrl = portfolioUrl
    coverLetter.tone = tone
    coverLetter.generatedContent = generatedContent

    await coverLetter.save()

    res.status(200).json({ message: "Cover letter updated successfully!" })
  } catch (error) {
    console.log("Update cover letter error:", error)
    res.status(500).json({ message: "Failed to update cover letter" })
  }
})

// DELETE a cover letter (login required)
router.delete("/:id", protect, async (req, res) => {
  try {
    const coverLetter = await CoverLetter.findOne({ _id: req.params.id, user: req.userId })

    if (!coverLetter) {
      return res.status(404).json({ message: "Cover letter not found" })
    }

    await coverLetter.deleteOne()
    res.status(200).json({ message: "Cover letter deleted" })
  } catch (error) {
    console.log("Delete cover letter error:", error)
    res.status(500).json({ message: "Failed to delete cover letter" })
  }
})

module.exports = router