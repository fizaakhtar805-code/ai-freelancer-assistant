const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const authRoutes = require("./routes/auth")
const proposalRoutes = require("./routes/proposal")
const coverLetterRoutes = require("./routes/coverletter")
const gigRoutes = require("./routes/gig")
const pricingRoutes = require("./routes/pricing")
const clientReplyRoutes = require("./routes/clientreply")
const invoiceRoutes = require("./routes/invoice")
const contractRoutes = require("./routes/contract")

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.log("MongoDB connection error:", err))

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/proposals", proposalRoutes)
app.use("/api/coverletters", coverLetterRoutes)
app.use("/api/gigs", gigRoutes)
app.use("/api/pricing", pricingRoutes)
app.use("/api/clientreplies", clientReplyRoutes)
app.use("/api/invoices", invoiceRoutes)
app.use("/api/contracts", contractRoutes)

app.get("/", (req, res) => {
  res.send("Server is running! 🚀")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})