import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import axios from "axios"

function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      })
      setSuccess(response.data.message)
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
        <h1>Create Account</h1>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
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

        <button className="btn-primary" onClick={handleSignup} disabled={loading}>
          {loading ? "Please wait..." : "Sign Up"}
        </button>

        <p className="auth-footer">Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  )
}

export default Signup