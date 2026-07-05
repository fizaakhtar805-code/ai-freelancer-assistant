import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"

function GigDescriptionHistory() {
  const navigate = useNavigate()
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState("")

  async function loadGigs() {
    setError("")
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Please log in to view your history.")
      setLoading(false)
      return
    }
    try {
      const response = await axios.get(`${API_URL}/api/gigs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setGigs(response.data)
    } catch (err) {
      setError("Failed to load gig descriptions.")
    }
    setLoading(false)
  }

  useEffect(() => {
    loadGigs()
  }, [])

  async function handleDelete(id) {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`${API_URL}/api/gigs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setGigs(gigs.filter((g) => g._id !== id))
    } catch (err) {
      alert("Failed to delete.")
    }
  }

  function handleCopy(gig, id) {
    const fullText = `${gig.generatedDescription}\n\nSEO Keywords:\n${gig.seoKeywords}\n\nFAQ Suggestions:\n${gig.faqSuggestions}`
    navigator.clipboard.writeText(fullText)
    setCopiedId(id)
    setTimeout(() => setCopiedId(""), 2000)
  }

  function handleEdit(gig) {
    navigate("/gig-description", { state: { gig } })
  }

  async function handleExportPDF(id, title) {
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get(`${API_URL}/api/gigs/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${(title || "gig").replace(/[^a-z0-9]/gi, "_")}.pdf`)
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
      <h1>Gig Description History</h1>
      <p className="page-subtitle">All your saved gig listings.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && gigs.length === 0 && !error && (
        <p className="placeholder-text">You haven't saved any gig descriptions yet.</p>
      )}

      <div className="history-list">
        {gigs.map((g) => (
          <div key={g._id} className="history-card">
            <div className="history-card-header">
              <div>
                <h3>{g.serviceCategory || "Untitled Gig"}</h3>
                <p className="history-meta">
                  {g.experienceLevel ? `${g.experienceLevel}` : ""} · {new Date(g.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="result-actions">
                <button onClick={() => handleCopy(g, g._id)}>{copiedId === g._id ? "Copied!" : "Copy"}</button>
                <button onClick={() => handleEdit(g)}>Edit</button>
                <button onClick={() => handleExportPDF(g._id, g.serviceCategory)}>Export PDF</button>
                <button onClick={() => handleDelete(g._id)} className="delete-btn">Delete</button>
              </div>
            </div>
            <div className="result-text">{g.generatedDescription}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GigDescriptionHistory