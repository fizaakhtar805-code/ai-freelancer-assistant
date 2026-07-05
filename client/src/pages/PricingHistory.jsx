import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"

function PricingHistory() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadItems() {
    setError("")
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Please log in to view your history.")
      setLoading(false)
      return
    }
    try {
      const response = await axios.get(`${API_URL}/api/pricing`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setItems(response.data)
    } catch (err) {
      setError("Failed to load pricing history.")
    }
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  async function handleDelete(id) {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`${API_URL}/api/pricing/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setItems(items.filter((i) => i._id !== id))
    } catch (err) {
      alert("Failed to delete.")
    }
  }

  async function handleExportPDF(id) {
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get(`${API_URL}/api/pricing/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "pricing_estimate.pdf")
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
      <h1>Pricing History</h1>
      <p className="page-subtitle">All your saved pricing estimates.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && !error && (
        <p className="placeholder-text">You haven't saved any pricing estimates yet.</p>
      )}

      <div className="history-list">
        {items.map((i) => (
          <div key={i._id} className="history-card">
            <div className="history-card-header">
              <div>
                <h3>${i.suggestedPrice} — {i.projectComplexity} / {i.urgency}</h3>
                <p className="history-meta">
                  Rate: ${i.hourlyRate}/hr · {i.estimatedHours} hrs · {new Date(i.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="result-actions">
                <button onClick={() => handleExportPDF(i._id)}>Export PDF</button>
                <button onClick={() => handleDelete(i._id)} className="delete-btn">Delete</button>
              </div>
            </div>
            <div className="result-text">{i.marketAnalysis}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PricingHistory