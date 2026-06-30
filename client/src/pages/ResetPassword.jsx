import { useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import axios from "axios"

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleReset() {
    setMessage("")
    setError("")
    setLoading(true)

    const token = searchParams.get("token")

    try {
      const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        password,
      })
      setMessage(response.data.message)
      setTimeout(() => navigate("/"), 2000)
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Reset Password</h1>

        {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div className="form-group">
          <label>New Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", paddingRight: "60px" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#666",
                display: "flex",
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
        </div>

        <button className="btn-primary" onClick={handleReset} disabled={loading}>
          {loading ? "Please wait..." : "Reset Password"}
        </button>

        <p className="auth-footer">Back to <Link to="/">Login</Link></p>
      </div>
    </div>
  )
}

export default ResetPassword