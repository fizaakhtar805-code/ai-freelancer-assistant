import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit() {
    setMessage("")
    setError("")

    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email,
      })
      setMessage(response.data.message)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Forgot Password</h1>

        {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div className="form-group">
          <label htmlFor="forgot-email">Email</label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={handleSubmit}>Send Reset Link</button>

        <p className="auth-footer">Remember your password? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}

export default ForgotPassword