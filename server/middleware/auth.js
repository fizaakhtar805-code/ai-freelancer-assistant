const jwt = require("jsonwebtoken")

const protect = (req, res, next) => {
  try {
    // Get the token from the request header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" })
    }

    const token = authHeader.split(" ")[1]

    // Verify the token and get the user's id
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id

    next() // continue to the actual route
  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" })
  }
}

module.exports = protect