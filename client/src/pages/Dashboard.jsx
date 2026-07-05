import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"

function Dashboard() {
  const navigate = useNavigate()
  const menuRef = useRef(null)

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null
  const userName = user ? user.name : "Guest"

  const [proposalCount, setProposalCount] = useState(0)
  const [coverLetterCount, setCoverLetterCount] = useState(0)
  const [invoiceCount, setInvoiceCount] = useState(0)
  const [recentActivities, setRecentActivities] = useState([])
  const [profilePicture, setProfilePicture] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    async function loadDashboardData() {
      const token = localStorage.getItem("token")
      if (!token) return
      const headers = { Authorization: `Bearer ${token}` }

      let allActivities = []

      try {
        const profileRes = await axios.get(`${API_URL}/api/profile`, { headers })
        setProfilePicture(profileRes.data.profilePicture)
      } catch (err) {
        console.log("Failed to load profile picture")
      }

      try {
        const res = await axios.get(`${API_URL}/api/proposals`, { headers })
        setProposalCount(res.data.length)
        res.data.forEach((p) =>
          allActivities.push({ label: `Proposal created for ${p.clientName || "a client"}`, date: p.createdAt })
        )
      } catch (err) {
        console.log("Failed to load proposals")
      }

      try {
        const res = await axios.get(`${API_URL}/api/coverletters`, { headers })
        setCoverLetterCount(res.data.length)
        res.data.forEach((l) =>
          allActivities.push({ label: `Cover letter written for ${l.companyName || "a company"}`, date: l.createdAt })
        )
      } catch (err) {
        console.log("Failed to load cover letters")
      }

      try {
        const res = await axios.get(`${API_URL}/api/invoices`, { headers })
        setInvoiceCount(res.data.length)
        res.data.forEach((i) =>
          allActivities.push({ label: `Invoice created for ${i.clientName} — $${i.totalAmount.toFixed(2)}`, date: i.createdAt })
        )
      } catch (err) {
        console.log("Failed to load invoices")
      }

      try {
        const res = await axios.get(`${API_URL}/api/gigs`, { headers })
        res.data.forEach((g) =>
          allActivities.push({ label: `Gig description created: ${g.serviceCategory || "Untitled"}`, date: g.createdAt })
        )
      } catch (err) {
        console.log("Failed to load gigs")
      }

      try {
        const res = await axios.get(`${API_URL}/api/pricing`, { headers })
        res.data.forEach((pr) =>
          allActivities.push({ label: `Pricing estimate calculated: $${pr.suggestedPrice}`, date: pr.createdAt })
        )
      } catch (err) {
        console.log("Failed to load pricing")
      }

      try {
        const res = await axios.get(`${API_URL}/api/clientreplies`, { headers })
        res.data.forEach((r) =>
          allActivities.push({ label: `Client reply drafted (${r.tone})`, date: r.createdAt })
        )
      } catch (err) {
        console.log("Failed to load client replies")
      }

      try {
        const res = await axios.get(`${API_URL}/api/contracts`, { headers })
        res.data.forEach((c) =>
          allActivities.push({ label: `Contract created for ${c.clientName || "a client"}`, date: c.createdAt })
        )
      } catch (err) {
        console.log("Failed to load contracts")
      }

      allActivities.sort((a, b) => new Date(b.date) - new Date(a.date))
      setRecentActivities(allActivities.slice(0, 5))
    }

    loadDashboardData()
  }, [])

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="dashboard">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back, {userName}!</p>
        </div>

        <div className="profile-menu-wrapper" ref={menuRef}>
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            title="Account menu"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--surface)",
              border: "2px solid var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: 700,
              color: "var(--ink)",
              fontSize: "18px",
              boxShadow: "0 2px 8px rgba(30,42,71,0.08)",
              overflow: "hidden",
            }}
          >
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              userName ? userName[0].toUpperCase() : "?"
            )}
          </div>

          {menuOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-item" onClick={() => { setMenuOpen(false); navigate("/profile") }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                Account Settings
              </div>
              <div className="profile-dropdown-item" onClick={() => { setMenuOpen(false); navigate("/settings") }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                App Settings
              </div>
              <div className="profile-dropdown-divider"></div>
              <div className="profile-dropdown-item logout" onClick={handleLogout}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="widgets">
        <div className="widget-card">
          <h2>{proposalCount}</h2>
          <p>Total Proposals</p>
        </div>

        <div className="widget-card">
          <h2>{coverLetterCount}</h2>
          <p>Cover Letters</p>
        </div>

        <div className="widget-card">
          <h2>0</h2>
          <p>Active Clients</p>
        </div>

        <div className="widget-card">
          <h2>{invoiceCount}</h2>
          <p>Total Invoices</p>
        </div>

        <div className="widget-card">
          <h2>100</h2>
          <p>AI Credits</p>
        </div>
      </div>

      <h3 className="section-title">Recent Activities</h3>
      <div className="activity-box">
        {recentActivities.length === 0 ? (
          "No activities yet."
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {recentActivities.map((activity, index) => (
              <li
                key={index}
                style={{
                  padding: "10px 0",
                  borderBottom: index < recentActivities.length - 1 ? "1px solid var(--border)" : "none",
                  color: "var(--ink)",
                }}
              >
                {activity.label}
                <span style={{ color: "var(--ink-muted)", fontSize: "13px", marginLeft: "8px" }}>
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h3 className="section-title">Quick Actions</h3>

      <div className="actions-section">
        <h4>Proposals & Letters</h4>
        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate("/proposal")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>Create Proposal</span>
          </div>
          <div className="action-card" onClick={() => navigate("/proposal-history")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>
            <span>Proposal History</span>
          </div>
          <div className="action-card" onClick={() => navigate("/cover-letter")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>
            <span>Write Cover Letter</span>
          </div>
          <div className="action-card" onClick={() => navigate("/cover-letter-history")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>
            <span>Cover Letter History</span>
          </div>
        </div>
      </div>

      <div className="actions-section">
        <h4>Gigs & Pricing</h4>
        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate("/gig-description")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"/><circle cx="7" cy="7" r="1"/></svg>
            <span>Create Gig</span>
          </div>
          <div className="action-card" onClick={() => navigate("/gig-description-history")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>
            <span>Gig History</span>
          </div>
          <div className="action-card" onClick={() => navigate("/pricing-calculator")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/></svg>
            <span>Price My Project</span>
          </div>
          <div className="action-card" onClick={() => navigate("/pricing-history")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>
            <span>Pricing History</span>
          </div>
        </div>
      </div>

      <div className="actions-section">
        <h4>Client Communication</h4>
        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate("/client-reply")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Client Reply</span>
          </div>
          <div className="action-card" onClick={() => navigate("/client-reply-history")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>
            <span>Reply History</span>
          </div>
        </div>
      </div>

      <div className="actions-section">
        <h4>Invoices & Contracts</h4>
        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate("/invoice")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="13" y2="15"/></svg>
            <span>Generate Invoice</span>
          </div>
          <div className="action-card" onClick={() => navigate("/invoice-history")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>
            <span>Invoice History</span>
          </div>
          <div className="action-card" onClick={() => navigate("/contract")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            <span>Create Contract</span>
          </div>
          <div className="action-card" onClick={() => navigate("/contract-history")}>
            <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>
            <span>Contract History</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard