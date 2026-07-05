import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"

function ContractHistory() {
  const navigate = useNavigate()
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState("")

  async function loadContracts() {
    setError("")
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Please log in to view your history.")
      setLoading(false)
      return
    }
    try {
      const response = await axios.get(`${API_URL}/api/contracts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setContracts(response.data)
    } catch (err) {
      setError("Failed to load contracts.")
    }
    setLoading(false)
  }

  useEffect(() => {
    loadContracts()
  }, [])

  async function handleDelete(id) {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`${API_URL}/api/contracts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setContracts(contracts.filter((c) => c._id !== id))
    } catch (err) {
      alert("Failed to delete.")
    }
  }

  function handleCopy(text, id) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(""), 2000)
  }

  async function handleExportPDF(id) {
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get(`${API_URL}/api/contracts/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `contract_${id}.pdf`)
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
      <h1>Contract History</h1>
      <p className="page-subtitle">All your saved contracts.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && contracts.length === 0 && !error && (
        <p className="placeholder-text">You haven't saved any contracts yet.</p>
      )}

      <div className="history-list">
        {contracts.map((c) => (
          <div key={c._id} className="history-card">
            <div className="history-card-header">
              <div>
                <h3>{c.clientName} × {c.freelancerName}</h3>
                <p className="history-meta">
                  {c.timeline || "No timeline"} · {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="result-actions">
                <button onClick={() => handleCopy(c.generatedContract, c._id)}>{copiedId === c._id ? "Copied!" : "Copy"}</button>
                <button onClick={() => handleExportPDF(c._id)}>Export PDF</button>
                <button onClick={() => handleDelete(c._id)} className="delete-btn">Delete</button>
              </div>
            </div>
            <div className="result-text">{c.generatedContract}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContractHistory