const express = require("express")
const PDFDocument = require("pdfkit")
const Contract = require("../models/Contract")
const generateAIContent = require("../config/gemini")
const protect = require("../middleware/auth")

const router = express.Router()

// GENERATE a contract with AI (no login needed just to generate)
router.post("/generate", async (req, res) => {
  try {
    const { clientName, freelancerName, projectScope, timeline, paymentTerms, termsAndConditions } = req.body

    if (!clientName || !freelancerName || !projectScope) {
      return res.status(400).json({ message: "Client name, freelancer name, and project scope are required" })
    }

    if (projectScope.length > 2000) {
      return res.status(400).json({ message: "Project scope is too long (max 2000 characters)" })
    }

    const prompt = `
Write a professional freelance service contract based on these details:

Client Name: ${clientName}
Freelancer Name: ${freelancerName}
Project Scope: ${projectScope}
Timeline: ${timeline || "to be agreed upon"}
Payment Terms: ${paymentTerms || "to be agreed upon"}
Additional Terms & Conditions: ${termsAndConditions || "standard freelance terms apply"}

Write a clear, well-structured contract with numbered sections covering: Parties Involved, Scope of Work, Timeline, Payment Terms, Revisions Policy, Termination Clause, and Signatures section at the end. Keep it professional and ready to use.

IMPORTANT FORMATTING RULE: Do not use any Markdown formatting. Do not use asterisks (*), double asterisks (**), hyphens as bullets, or any special symbols for emphasis or lists. Use plain text only. For lists, use simple numbering like "1." or indent with spaces, not symbols. For section headings, just write the heading in plain text on its own line, optionally in capital letters.
`

    const generatedContract = await generateAIContent(prompt)

    res.status(200).json({ generatedContract })
  } catch (error) {
    console.log("Generate contract error:", error)
    res.status(500).json({ message: "Failed to generate contract", error: error.message })
  }
})

// SAVE a contract (login required)
router.post("/save", protect, async (req, res) => {
  try {
    const { clientName, freelancerName, projectScope, timeline, paymentTerms, termsAndConditions, generatedContract } = req.body

    const contract = new Contract({
      user: req.userId,
      clientName,
      freelancerName,
      projectScope,
      timeline,
      paymentTerms,
      termsAndConditions,
      generatedContract,
    })

    await contract.save()

    res.status(201).json({ message: "Contract saved successfully!" })
  } catch (error) {
    console.log("Save contract error:", error)
    res.status(500).json({ message: "Failed to save contract" })
  }
})

// GET all contracts for the logged-in user (login required)
router.get("/", protect, async (req, res) => {
  try {
    const contracts = await Contract.find({ user: req.userId }).sort({ createdAt: -1 })
    res.status(200).json(contracts)
  } catch (error) {
    console.log("Get contracts error:", error)
    res.status(500).json({ message: "Failed to fetch contracts" })
  }
})

// EXPORT a contract as PDF (login required)
router.get("/:id/pdf", protect, async (req, res) => {
  try {
    const contract = await Contract.findOne({ _id: req.params.id, user: req.userId })
    if (!contract) return res.status(404).json({ message: "Contract not found" })

    const doc = new PDFDocument({ margin: 50 })
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="contract_${contract._id}.pdf"`)
    doc.pipe(res)

    doc.fontSize(20).text("Freelance Service Contract", { underline: true })
    doc.moveDown()

    doc.fontSize(11).fillColor("#555")
    doc.text(`Client: ${contract.clientName}`)
    doc.text(`Freelancer: ${contract.freelancerName}`)
    doc.text(`Date: ${new Date(contract.createdAt).toLocaleDateString()}`)
    doc.moveDown()

    doc.fillColor("#000").fontSize(12).text(contract.generatedContract, { lineGap: 4 })

    doc.end()
  } catch (error) {
    console.log("Export contract PDF error:", error)
    res.status(500).json({ message: "Failed to export PDF" })
  }
})

// DELETE a contract (login required)
router.delete("/:id", protect, async (req, res) => {
  try {
    const contract = await Contract.findOne({ _id: req.params.id, user: req.userId })
    if (!contract) return res.status(404).json({ message: "Contract not found" })
    await contract.deleteOne()
    res.status(200).json({ message: "Contract deleted" })
  } catch (error) {
    console.log("Delete contract error:", error)
    res.status(500).json({ message: "Failed to delete contract" })
  }
})

module.exports = router