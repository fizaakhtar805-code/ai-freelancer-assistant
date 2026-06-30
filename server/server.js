const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const authRoutes = require("./routes/auth")

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.log("MongoDB connection error:", err))

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("Server is running! 🚀")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})