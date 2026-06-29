import { Link, useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  function handleLogin() {
    navigate("/dashboard")
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Login</h1>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>

        <button className="btn-primary" onClick={handleLogin}>Login</button>

        <p className="auth-footer">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  )
}

export default Login