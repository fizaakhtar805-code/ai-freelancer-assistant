import { Link, useNavigate } from "react-router-dom"

function Signup() {
  const navigate = useNavigate()

  function handleSignup() {
    navigate("/dashboard")
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Create Account</h1>

        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Enter your name" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Create a password" />
        </div>

        <button className="btn-primary" onClick={handleSignup}>Sign Up</button>

        <p className="auth-footer">Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  )
}

export default Signup