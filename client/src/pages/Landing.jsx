import { useNavigate } from "react-router-dom"

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-logo">AI Freelancer Assistant</div>
        <button className="landing-get-started" onClick={() => navigate("/login")}>
          Get Started →
        </button>
      </nav>

      {/* Floating decorative icons */}
      <svg className="floating-icon floating-icon-1" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <svg className="floating-icon floating-icon-2" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/></svg>
      <svg className="floating-icon floating-icon-3" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
      <svg className="floating-icon floating-icon-4" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
      <svg className="floating-icon floating-icon-5" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      <svg className="floating-icon floating-icon-6" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"/><circle cx="7" cy="7" r="1"/></svg>

      <div className="landing-hero">
        <h1>Your freelance paperwork, written in seconds.</h1>
        <p>
          Generate proposals, cover letters, contracts, invoices, and pricing estimates
          with AI — so you can spend less time writing and more time working.
        </p>
        <div className="landing-cta">
          <button className="landing-get-started" onClick={() => navigate("/login")} style={{ padding: "14px 32px", fontSize: "15px" }}>
            Get Started →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Landing