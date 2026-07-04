const express = require("express")
const PDFDocument = require("pdfkit")
const GigDescription = require("../models/GigDescription")
const generateAIContent = require("../config/gemini")
const protect = require("../middleware/auth")

const router = express.Router()

// GENERATE a gig description with AI (no login needed just to generate)
router.post("/generate", async (req, res) => {
  try {
    const { serviceCategory, skills, experienceLevel, deliveryTime, features, revisions } = req.body

    if (!serviceCategory || !skills) {
      return res.status(400).json({ message: "Service category and skills are required" })
    }

    if (features && features.length > 1000) {
      return res.status(400).json({ message: "Features text is too long (max 1000 characters)" })
    }

    const prompt = `
Write a professional freelance gig listing based on these details:

Service Category: ${serviceCategory}
Skills: ${skills}
Experience Level: ${experienceLevel || "not specified"}
Delivery Time: ${deliveryTime || "not specified"}
Features Included: ${features || "not specified"}
Revisions Offered: ${revisions || "not specified"}

Respond with ONLY a valid JSON object (no markdown, no extra text, no code fences) in exactly this format:
{
  "description": "a persuasive, well-structured gig description, 3-4 short paragraphs",
  "seoKeywords": "8-10 relevant SEO keywords, comma separated",
  "faqSuggestions": "3 likely client questions with short answers, formatted as Q: ... A: ... on separate lines"
}
`

    const aiResponse = await generateAIContent(prompt)

    let cleaned = aiResponse.replace(/```json|```/g, "").trim()

    cleaned = cleaned.replace(/"(?:[^"\\]|\\.)*"/g, (match) =>
      match.replace(/\r\n|\r|\n/g, "\\n")
    )

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch (parseErr) {
      console.log("JSON parse failed, raw AI response:", aiResponse)
      return res.status(500).json({ message: "AI response could not be processed. Please try again." })
    }

    res.status(200).json({
      description: parsed.description || "",
      seoKeywords: parsed.seoKeywords || "",
      faqSuggestions: parsed.faqSuggestions || "",
    })
  } catch (error) {
    console.log("Generate gig description error:", error)
    res.status(500).json({ message: "Failed to generate gig description", error: error.message })
  }
})

// SAVE a gig description (login required)
router.post("/save", protect, async (req, res) => {
  try {
    const { serviceCategory, skills, experienceLevel, deliveryTime, features, revisions, generatedDescription, seoKeywords, faqSuggestions } = req.body

    const gig = new GigDescription({
      user: req.userId,
      serviceCategory,
      skills,
      experienceLevel,
      deliveryTime,
      features,
      revisions,
      generatedDescription,
      seoKeywords,
      faqSuggestions,
    })

    await gig.save()

    res.status(201).json({ message: "Gig description saved successfully!" })
  } catch (error) {
    console.log("Save gig description error:", error)
    res.status(500).json({ message: "Failed to save gig description" })
  }
})

// GET all gig descriptions for the logged-in user (login required)
router.get("/", protect, async (req, res) => {
  try {
    const gigs = await GigDescription.find({ user: req.userId }).sort({ createdAt: -1 })
    res.status(200).json(gigs)
  } catch (error) {
    console.log("Get gig descriptions error:", error)
    res.status(500).json({ message: "Failed to fetch gig descriptions" })
  }
})

// EXPORT a gig description as PDF (login required)
router.get("/:id/pdf", protect, async (req, res) => {
  try {
    const gig = await GigDescription.findOne({ _id: req.params.id, user: req.userId })

    if (!gig) {
      return res.status(404).json({ message: "Gig description not found" })
    }

    const doc = new PDFDocument({ margin: 50 })

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${(gig.serviceCategory || "gig").replace(/[^a-z0-9]/gi, "_")}.pdf"`
    )

    doc.pipe(res)

    doc.fontSize(20).text(gig.serviceCategory || "Gig Description", { underline: true })
    doc.moveDown()

    doc.fontSize(11).fillColor("#555")
    doc.text(`Experience Level: ${gig.experienceLevel || "N/A"}`)
    doc.text(`Delivery Time: ${gig.deliveryTime || "N/A"}`)
    doc.text(`Date: ${new Date(gig.createdAt).toLocaleDateString()}`)
    doc.moveDown()

    doc.fillColor("#000").fontSize(13).text("Description", { underline: true })
    doc.fontSize(12).text(gig.generatedDescription, { lineGap: 4 })
    doc.moveDown()

    doc.fontSize(13).text("SEO Keywords", { underline: true })
    doc.fontSize(12).text(gig.seoKeywords, { lineGap: 4 })
    doc.moveDown()

    doc.fontSize(13).text("FAQ Suggestions", { underline: true })
    doc.fontSize(12).text(gig.faqSuggestions, { lineGap: 4 })

    doc.end()
  } catch (error) {
    console.log("Export PDF error:", error)
    res.status(500).json({ message: "Failed to export PDF" })
  }
})

// UPDATE a gig description (login required)
router.put("/:id", protect, async (req, res) => {
  try {
    const gig = await GigDescription.findOne({ _id: req.params.id, user: req.userId })

    if (!gig) {
      return res.status(404).json({ message: "Gig description not found" })
    }

    const { serviceCategory, skills, experienceLevel, deliveryTime, features, revisions, generatedDescription, seoKeywords, faqSuggestions } = req.body

    gig.serviceCategory = serviceCategory
    gig.skills = skills
    gig.experienceLevel = experienceLevel
    gig.deliveryTime = deliveryTime
    gig.features = features
    gig.revisions = revisions
    gig.generatedDescription = generatedDescription
    gig.seoKeywords = seoKeywords
    gig.faqSuggestions = faqSuggestions

    await gig.save()

    res.status(200).json({ message: "Gig description updated successfully!" })
  } catch (error) {
    console.log("Update gig description error:", error)
    res.status(500).json({ message: "Failed to update gig description" })
  }
})

// DELETE a gig description (login required)
router.delete("/:id", protect, async (req, res) => {
  try {
    const gig = await GigDescription.findOne({ _id: req.params.id, user: req.userId })

    if (!gig) {
      return res.status(404).json({ message: "Gig description not found" })
    }

    await gig.deleteOne()
    res.status(200).json({ message: "Gig description deleted" })
  } catch (error) {
    console.log("Delete gig description error:", error)
    res.status(500).json({ message: "Failed to delete gig description" })
  }
})

module.exports = router