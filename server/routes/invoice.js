const express = require("express")
const PDFDocument = require("pdfkit")
const Invoice = require("../models/Invoice")
const protect = require("../middleware/auth")

const router = express.Router()

// CREATE and SAVE an invoice (login required, no AI needed — just calculation)
router.post("/save", protect, async (req, res) => {
  try {
    const { clientName, clientEmail, projectDetails, services, amount, dueDate, tax } = req.body

    const amountNum = parseFloat(amount) || 0
    const taxNum = parseFloat(tax) || 0
    const totalAmount = Math.round((amountNum + amountNum * (taxNum / 100)) * 100) / 100

    const invoice = new Invoice({
      user: req.userId,
      clientName,
      clientEmail,
      projectDetails,
      services,
      amount: amountNum,
      dueDate,
      tax: taxNum,
      totalAmount,
    })

    await invoice.save()

    res.status(201).json({ message: "Invoice created successfully!", invoice })
  } catch (error) {
    console.log("Save invoice error:", error)
    res.status(500).json({ message: "Failed to create invoice" })
  }
})

// GET all invoices for the logged-in user (login required)
router.get("/", protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.userId }).sort({ createdAt: -1 })
    res.status(200).json(invoices)
  } catch (error) {
    console.log("Get invoices error:", error)
    res.status(500).json({ message: "Failed to fetch invoices" })
  }
})

// EXPORT an invoice as PDF (login required)
router.get("/:id/pdf", protect, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.userId })
    if (!invoice) return res.status(404).json({ message: "Invoice not found" })

    const doc = new PDFDocument({ margin: 50 })
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="invoice_${invoice._id}.pdf"`)
    doc.pipe(res)

    doc.fontSize(22).text("INVOICE", { underline: true })
    doc.moveDown()

    doc.fontSize(11).fillColor("#555")
    doc.text(`Invoice Date: ${new Date(invoice.createdAt).toLocaleDateString()}`)
    doc.text(`Due Date: ${invoice.dueDate || "N/A"}`)
    doc.moveDown()

    doc.fillColor("#000").fontSize(13).text("Bill To", { underline: true })
    doc.fontSize(12).text(invoice.clientName || "N/A")
    if (invoice.clientEmail) doc.text(invoice.clientEmail)
    doc.moveDown()

    doc.fontSize(13).text("Project Details", { underline: true })
    doc.fontSize(12).text(invoice.projectDetails || "N/A", { lineGap: 4 })
    doc.moveDown()

    doc.fontSize(13).text("Services", { underline: true })
    doc.fontSize(12).text(invoice.services || "N/A", { lineGap: 4 })
    doc.moveDown()

    doc.fontSize(12).text(`Subtotal: $${invoice.amount.toFixed(2)}`)
    doc.text(`Tax: ${invoice.tax}%`)
    doc.moveDown()
    doc.fontSize(16).text(`Total Due: $${invoice.totalAmount.toFixed(2)}`, { underline: true })

    doc.end()
  } catch (error) {
    console.log("Export invoice PDF error:", error)
    res.status(500).json({ message: "Failed to export PDF" })
  }
})

// DELETE an invoice (login required)
router.delete("/:id", protect, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.userId })
    if (!invoice) return res.status(404).json({ message: "Invoice not found" })
    await invoice.deleteOne()
    res.status(200).json({ message: "Invoice deleted" })
  } catch (error) {
    console.log("Delete invoice error:", error)
    res.status(500).json({ message: "Failed to delete invoice" })
  }
})

module.exports = router