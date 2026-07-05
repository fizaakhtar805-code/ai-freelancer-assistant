import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [message, setMessage] = useState("Verifying your email...")

  useEffect(() => {
    const token = searchParams.get("token")

    async function verify() {
      try {
        const response = await axios.get(
          `${API_URL}/api/auth/verify-email?token=${token}`
        )
        setMessage(response.data.message)
      } catch (err) {
        if (err.response && err.response.data) {
          setMessage(err.response.data.message)
        } else {
          setMessage("Something went wrong.")
        }
      }
    }

    verify()
  }, [searchParams])

  return (
    <div className="auth-container">
      <div className="auth-box" style={{ textAlign: "center" }}>
        <h1>Email Verification</h1>
        <p style={{ margin: "20px 0" }}>{message}</p>
        <Link to="/login" className="btn-primary" style={{ display: "inline-block", textDecoration: "none", textAlign: "center" }}>
          Go to Login
        </Link>
      </div>
    </div>
  )
}

export default VerifyEmail