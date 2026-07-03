import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function ClientReplyHistory() {
  const navigate = useNavigate()
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState("")

  async function loadReplies() {
    setError("")
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Please log in to view your history.")
      setLoading(false)
      return
    }
    try {
      const response = await axios.get("http://localhost:5000/api/clientreplies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReplies(response.data)
    } catch (err) {
      setError("Failed to load replies.")
    }
    setLoading(false)
  }

  useEffect(() => {
    loadReplies()
  }, [])

  async function handleDelete(id) {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`http://localhost:5000/api/clientreplies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReplies(replies.filter((r) => r._id !== id))
    } catch (err) {
      alert("Failed to delete.")
    }
  }

  function handleCopy(text, id) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(""), 2000)
  }

  return (
    <div className="generator-page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
      <h1>Client Reply History</h1>
      <p className="page-subtitle">All your saved replies.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && replies.length === 0 && !error && (
        <p className="placeholder-text">You haven't saved any replies yet.</p>
      )}

      <div className="history-list">
        {replies.map((r) => (
          <div key={r._id} className="history-card">
            <div className="history-card-header">
              <div>
                <h3>{r.tone} Reply</h3>
                <p className="history-meta">
                  "{r.clientMessage.slice(0, 60)}{r.clientMessage.length > 60 ? "..." : ""}" · {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="result-actions">
                <button onClick={() => handleCopy(r.generatedReply, r._id)}>{copiedId === r._id ? "Copied!" : "Copy"}</button>
                <button onClick={() => handleDelete(r._id)} className="delete-btn">Delete</button>
              </div>
            </div>
            <div className="result-text">{r.generatedReply}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientReplyHistory