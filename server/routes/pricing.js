const express = require("express")
const PDFDocument = require("pdfkit")
const PricingHistory = require("../models/PricingHistory")
const generateAIContent = require("../config/gemini")
const protect = require("../middleware/auth")

const router = express.Router()

const complexityMultiplier = { Simple: 1, Medium: 1.2, Complex: 1.5 }
const urgencyMultiplier = { Standard: 1, Urgent: 1.15, "Very Urgent": 1.3 }

// GENERATE pricing suggestion (formula for price, AI for advice text)
router.post("/generate", async (req, res) => {
  try {
    const { hourlyRate, estimatedHours, projectComplexity, urgency, additionalCharges, tax } = req.body

    const rate = parseFloat(hourlyRate) || 0
    const hours = parseFloat(estimatedHours) || 0
    const extra = parseFloat(additionalCharges) || 0
    const taxPercent = parseFloat(tax) || 0

    if (rate <= 0 || hours <= 0) {
      return res.status(400).json({ message: "Hourly rate and estimated hours are required" })
    }

    const cMultiplier = complexityMultiplier[projectComplexity] || 1
    const uMultiplier = urgencyMultiplier[urgency] || 1

    let suggestedPrice = rate * hours * cMultiplier * uMultiplier + extra
    suggestedPrice = suggestedPrice + suggestedPrice * (taxPercent / 100)
    suggestedPrice = Math.round(suggestedPrice * 100) / 100

    const prompt = `
A freelancer is pricing a project with these details:
Hourly Rate: $${rate}
Estimated Hours: ${hours}
Project Complexity: ${projectComplexity || "Medium"}
Urgency: ${urgency || "Standard"}
Additional Charges: $${extra}
Tax: ${taxPercent}%
Calculated Suggested Price: $${suggestedPrice}

Respond with ONLY a valid JSON object (no markdown, no code fences) in exactly this format:
{
  "recommendedDeliveryTime": "a short recommendation for delivery time based on the hours and urgency, one sentence",
  "marketAnalysis": "2-3 sentences comparing this price to typical market rates for this type of work",
  "serviceImprovementTips": "2-3 short actionable tips to help the freelancer increase their value or price further"
}
`

    const aiResponse = await generateAIContent(prompt)
    let cleaned = aiResponse.replace(/```json|```/g, "").trim()
    cleaned = cleaned.replace(/"(?:[^"\\]|\\.)*"/g, (match) => match.replace(/\r\n|\r|\n/g, "\\n"))

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch (parseErr) {
      console.log("JSON parse failed, raw AI response:", aiResponse)
      parsed = { recommendedDeliveryTime: "", marketAnalysis: "", serviceImprovementTips: "" }
    }

    res.status(200).json({
      suggestedPrice,
      recommendedDeliveryTime: parsed.recommendedDeliveryTime || "",
      marketAnalysis: parsed.marketAnalysis || "",
      serviceImprovementTips: parsed.serviceImprovementTips || "",
    })
  } catch (error) {
    console.log("Generate pricing error:", error)
    res.status(500).json({ message: "Failed to generate pricing suggestion", error: error.message })
  }
})

// SAVE pricing history (login required)
router.post("/save", protect, async (req, res) => {
  try {
    const data = req.body
    const pricing = new PricingHistory({ user: req.userId, ...data })
    await pricing.save()
    res.status(201).json({ message: "Pricing saved successfully!" })
  } catch (error) {
    console.log("Save pricing error:", error)
    res.status(500).json({ message: "Failed to save pricing" })
  }
})

// GET all pricing history (login required)
router.get("/", protect, async (req, res) => {
  try {
    const items = await PricingHistory.find({ user: req.userId }).sort({ createdAt: -1 })
    res.status(200).json(items)
  } catch (error) {
    console.log("Get pricing history error:", error)
    res.status(500).json({ message: "Failed to fetch pricing history" })
  }
})

// EXPORT pricing as PDF (login required)
router.get("/:id/pdf", protect, async (req, res) => {
  try {
    const item = await PricingHistory.findOne({ _id: req.params.id, user: req.userId })
    if (!item) return res.status(404).json({ message: "Pricing entry not found" })

    const doc = new PDFDocument({ margin: 50 })
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="pricing_estimate.pdf"`)
    doc.pipe(res)

    doc.fontSize(20).text("Pricing Estimate", { underline: true })
    doc.moveDown()
    doc.fontSize(11).fillColor("#555")
    doc.text(`Hourly Rate: $${item.hourlyRate}`)
    doc.text(`Estimated Hours: ${item.estimatedHours}`)
    doc.text(`Complexity: ${item.projectComplexity}`)
    doc.text(`Urgency: ${item.urgency}`)
    doc.text(`Additional Charges: $${item.additionalCharges}`)
    doc.text(`Tax: ${item.tax}%`)
    doc.text(`Date: ${new Date(item.createdAt).toLocaleDateString()}`)
    doc.moveDown()
    doc.fillColor("#000").fontSize(16).text(`Suggested Price: $${item.suggestedPrice}`, { underline: true })
    doc.moveDown()
    doc.fontSize(13).text("Recommended Delivery Time", { underline: true })
    doc.fontSize(12).text(item.recommendedDeliveryTime, { lineGap: 4 })
    doc.moveDown()
    doc.fontSize(13).text("Market Analysis", { underline: true })
    doc.fontSize(12).text(item.marketAnalysis, { lineGap: 4 })
    doc.moveDown()
    doc.fontSize(13).text("Service Improvement Tips", { underline: true })
    doc.fontSize(12).text(item.serviceImprovementTips, { lineGap: 4 })

    doc.end()
  } catch (error) {
    console.log("Export PDF error:", error)
    res.status(500).json({ message: "Failed to export PDF" })
  }
})

// DELETE pricing entry (login required)
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await PricingHistory.findOne({ _id: req.params.id, user: req.userId })
    if (!item) return res.status(404).json({ message: "Pricing entry not found" })
    await item.deleteOne()
    res.status(200).json({ message: "Pricing entry deleted" })
  } catch (error) {
    console.log("Delete pricing error:", error)
    res.status(500).json({ message: "Failed to delete pricing entry" })
  }
})

module.exports = router