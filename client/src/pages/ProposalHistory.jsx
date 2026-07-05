import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"

function ProposalHistory() {
  const navigate = useNavigate()

  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState("")

  async function loadProposals() {
    setError("")
    const token = localStorage.getItem("token")

    if (!token) {
      setError("Please log in to view your history.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.get(`${API_URL}/api/proposals`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProposals(response.data)
    } catch (err) {
      setError("Failed to load proposals.")
    }

    setLoading(false)
  }

  useEffect(() => {
    loadProposals()
  }, [])

  async function handleDelete(id) {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`${API_URL}/api/proposals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProposals(proposals.filter((p) => p._id !== id))
    } catch (err) {
      alert("Failed to delete.")
    }
  }

  function handleCopy(text, id) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(""), 2000)
  }

  function handleEdit(proposal) {
    navigate("/proposal", { state: { proposal } })
  }

  async function handleExportPDF(id, title) {
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get(`${API_URL}/api/proposals/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${(title || "proposal").replace(/[^a-z0-9]/gi, "_")}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert("Failed to export PDF.")
    }
  }

  return (
    <div className="generator-page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>

      <h1>Proposal History</h1>
      <p className="page-subtitle">All your saved proposals.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && proposals.length === 0 && !error && (
        <p className="placeholder-text">You haven't saved any proposals yet.</p>
      )}

      <div className="history-list">
        {proposals.map((p) => (
          <div key={p._id} className="history-card">
            <div className="history-card-header">
              <div>
                <h3>{p.projectTitle || "Untitled Proposal"}</h3>
                <p className="history-meta">
                  {p.clientName ? `Client: ${p.clientName}` : "No client"} ·{" "}
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="result-actions">
                <button onClick={() => handleCopy(p.generatedContent, p._id)}>
                  {copiedId === p._id ? "Copied!" : "Copy"}
                </button>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleExportPDF(p._id, p.projectTitle)}>Export PDF</button>
                <button onClick={() => handleDelete(p._id)} className="delete-btn">Delete</button>
              </div>
            </div>
            <div className="result-text">{p.generatedContent}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProposalHistory