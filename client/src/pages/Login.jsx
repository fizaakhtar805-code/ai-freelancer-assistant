import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleLogin() {
    setError("") // clear any old error

    try {
      // Send login data to the backend
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      })

      // Save the token and user info in the browser's storage
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      // Go to the dashboard
      navigate("/dashboard")
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Login</h1>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

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
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={handleLogin}>Login</button>

        <p className="auth-footer">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  )
}

export default Login