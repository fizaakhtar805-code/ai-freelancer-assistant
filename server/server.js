const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const mongoose = require("mongoose")
const authRoutes = require("./routes/auth")
const proposalRoutes = require("./routes/proposal")
const coverLetterRoutes = require("./routes/coverletter")
const gigRoutes = require("./routes/gig")
const pricingRoutes = require("./routes/pricing")
const clientReplyRoutes = require("./routes/clientreply")
const invoiceRoutes = require("./routes/invoice")
const contractRoutes = require("./routes/contract")
const profileRoutes = require("./routes/profile")

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.log("MongoDB connection error:", err))

const app = express()

// Security headers
app.use(helmet())

app.use(cors())
app.use(express.json({ limit: "5mb" }))

// Rate limiting: general API protection (100 requests per 15 min per IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
})
app.use("/api", generalLimiter)

// Stricter limit specifically for AI generation routes (protects your Groq quota)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many AI generation requests. Please wait a few minutes and try again." },
})
app.use("/api/proposals/generate", aiLimiter)
app.use("/api/coverletters/generate", aiLimiter)
app.use("/api/gigs/generate", aiLimiter)
app.use("/api/pricing/generate", aiLimiter)
app.use("/api/clientreplies/generate", aiLimiter)
app.use("/api/contracts/generate", aiLimiter)

app.use("/api/auth", authRoutes)
app.use("/api/proposals", proposalRoutes)
app.use("/api/coverletters", coverLetterRoutes)
app.use("/api/gigs", gigRoutes)
app.use("/api/pricing", pricingRoutes)
app.use("/api/clientreplies", clientReplyRoutes)
app.use("/api/invoices", invoiceRoutes)
app.use("/api/contracts", contractRoutes)
app.use("/api/profile", profileRoutes)

app.get("/", (req, res) => {
  res.send("Server is running! 🚀")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})