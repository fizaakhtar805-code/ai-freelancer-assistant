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

  useEffect(() => {
    async function loadCounts() {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const proposalsRes = await axios.get("http://localhost:5000/api/proposals", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProposalCount(proposalsRes.data.length)
      } catch (err) {
        console.log("Failed to load proposal count")
      }

      try {
        const lettersRes = await axios.get("http://localhost:5000/api/coverletters", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCoverLetterCount(lettersRes.data.length)
      } catch (err) {
        console.log("Failed to load cover letter count")
      }
    }

    loadCounts()
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
          <h2>0</h2>
          <p>Total Invoices</p>
        </div>

        <div className="widget-card">
          <h2>100</h2>
          <p>AI Credits</p>
        </div>
      </div>

      <h3 className="section-title">Recent Activities</h3>
      <div className="activity-box">No activities yet.</div>

      <h3 className="section-title">Quick Actions</h3>
      <div className="quick-actions">
        <button onClick={() => navigate("/proposal")}>Create Proposal</button>
        <button onClick={() => navigate("/proposal-history")}>Proposal History</button>
        <button onClick={() => navigate("/cover-letter")}>Write Cover Letter</button>
        <button onClick={() => navigate("/cover-letter-history")}>Cover Letter History</button>
        <button>Create Gig</button>
        <button>Generate Invoice</button>
        <button>Create Contract</button>
      </div>
    </div>
  )
}

export default Dashboard