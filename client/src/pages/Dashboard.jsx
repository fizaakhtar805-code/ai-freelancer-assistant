import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Dashboard() {
  const navigate = useNavigate()

  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null
  const userName = user ? user.name : "Guest"

  const [proposalCount, setProposalCount] = useState(0)
  const [coverLetterCount, setCoverLetterCount] = useState(0)
  const [invoiceCount, setInvoiceCount] = useState(0)
  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    async function loadDashboardData() {
      const token = localStorage.getItem("token")
      if (!token) return
      const headers = { Authorization: `Bearer ${token}` }

      let allActivities = []

      try {
        const res = await axios.get("http://localhost:5000/api/proposals", { headers })
        setProposalCount(res.data.length)
        res.data.forEach((p) =>
          allActivities.push({
            label: `Proposal created for ${p.clientName || "a client"}`,
            date: p.createdAt,
          })
        )
      } catch (err) {
        console.log("Failed to load proposals")
      }

      try {
        const res = await axios.get("http://localhost:5000/api/coverletters", { headers })
        setCoverLetterCount(res.data.length)
        res.data.forEach((l) =>
          allActivities.push({
            label: `Cover letter written for ${l.companyName || "a company"}`,
            date: l.createdAt,
          })
        )
      } catch (err) {
        console.log("Failed to load cover letters")
      }

      try {
        const res = await axios.get("http://localhost:5000/api/invoices", { headers })
        setInvoiceCount(res.data.length)
        res.data.forEach((i) =>
          allActivities.push({
            label: `Invoice created for ${i.clientName} — $${i.totalAmount.toFixed(2)}`,
            date: i.createdAt,
          })
        )
      } catch (err) {
        console.log("Failed to load invoices")
      }

      try {
        const res = await axios.get("http://localhost:5000/api/gigs", { headers })
        res.data.forEach((g) =>
          allActivities.push({
            label: `Gig description created: ${g.serviceCategory || "Untitled"}`,
            date: g.createdAt,
          })
        )
      } catch (err) {
        console.log("Failed to load gigs")
      }

      try {
        const res = await axios.get("http://localhost:5000/api/pricing", { headers })
        res.data.forEach((pr) =>
          allActivities.push({
            label: `Pricing estimate calculated: $${pr.suggestedPrice}`,
            date: pr.createdAt,
          })
        )
      } catch (err) {
        console.log("Failed to load pricing")
      }

      try {
        const res = await axios.get("http://localhost:5000/api/clientreplies", { headers })
        res.data.forEach((r) =>
          allActivities.push({
            label: `Client reply drafted (${r.tone})`,
            date: r.createdAt,
          })
        )
      } catch (err) {
        console.log("Failed to load client replies")
      }

      try {
        const res = await axios.get("http://localhost:5000/api/contracts", { headers })
        res.data.forEach((c) =>
          allActivities.push({
            label: `Contract created for ${c.clientName || "a client"}`,
            date: c.createdAt,
          })
        )
      } catch (err) {
        console.log("Failed to load contracts")
      }

      allActivities.sort((a, b) => new Date(b.date) - new Date(a.date))
      setRecentActivities(allActivities.slice(0, 5))
    }

    loadDashboardData()
  }, [])

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="subtitle">Welcome back, {userName}!</p>

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
                  borderBottom: index < recentActivities.length - 1 ? "1px solid #eee" : "none",
                  color: "#333",
                }}
              >
                {activity.label}
                <span style={{ color: "#999", fontSize: "13px", marginLeft: "8px" }}>
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h3 className="section-title">Quick Actions</h3>
      <div className="quick-actions">
        <button onClick={() => navigate("/proposal")}>Create Proposal</button>
        <button onClick={() => navigate("/proposal-history")}>Proposal History</button>
        <button onClick={() => navigate("/cover-letter")}>Write Cover Letter</button>
        <button onClick={() => navigate("/cover-letter-history")}>Cover Letter History</button>
        <button onClick={() => navigate("/gig-description")}>Create Gig</button>
        <button onClick={() => navigate("/gig-description-history")}>Gig History</button>
        <button onClick={() => navigate("/pricing-calculator")}>Price My Project</button>
        <button onClick={() => navigate("/pricing-history")}>Pricing History</button>
        <button onClick={() => navigate("/client-reply")}>Client Reply</button>
        <button onClick={() => navigate("/client-reply-history")}>Reply History</button>
        <button onClick={() => navigate("/invoice")}>Generate Invoice</button>
        <button onClick={() => navigate("/invoice-history")}>Invoice History</button>
        <button onClick={() => navigate("/contract")}>Create Contract</button>
        <button onClick={() => navigate("/contract-history")}>Contract History</button>
      </div>
    </div>
  )
}

export default Dashboard