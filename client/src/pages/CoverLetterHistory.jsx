import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function CoverLetterHistory() {
  const navigate = useNavigate()

  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState("")

  async function loadLetters() {
    setError("")
    const token = localStorage.getItem("token")

    if (!token) {
      setError("Please log in to view your history.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.get("http://localhost:5000/api/coverletters", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLetters(response.data)
    } catch (err) {
      setError("Failed to load cover letters.")
    }

    setLoading(false)
  }

  useEffect(() => {
    loadLetters()
  }, [])

  async function handleDelete(id) {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`http://localhost:5000/api/coverletters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLetters(letters.filter((l) => l._id !== id))
    } catch (err) {
      alert("Failed to delete.")
    }
  }

  function handleCopy(text, id) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(""), 2000)
  }

  function handleEdit(coverLetter) {
    navigate("/cover-letter", { state: { coverLetter } })
  }

  async function handleExportPDF(id, title) {
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get(`http://localhost:5000/api/coverletters/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${(title || "cover_letter").replace(/[^a-z0-9]/gi, "_")}.pdf`)
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

      <h1>Cover Letter History</h1>
      <p className="page-subtitle">All your saved cover letters.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && letters.length === 0 && !error && (
        <p className="placeholder-text">You haven't saved any cover letters yet.</p>
      )}

      <div className="history-list">
        {letters.map((l) => (
          <div key={l._id} className="history-card">
            <div className="history-card-header">
              <div>
                <h3>{l.jobTitle || "Untitled Cover Letter"}</h3>
                <p className="history-meta">
                  {l.companyName ? `Company: ${l.companyName}` : "No company"} ·{" "}
                  {new Date(l.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="result-actions">
                <button onClick={() => handleCopy(l.generatedContent, l._id)}>
                  {copiedId === l._id ? "Copied!" : "Copy"}
                </button>
                <button onClick={() => handleEdit(l)}>Edit</button>
                <button onClick={() => handleExportPDF(l._id, l.jobTitle)}>Export PDF</button>
                <button onClick={() => handleDelete(l._id)} className="delete-btn">Delete</button>
              </div>
            </div>
            <div className="result-text">{l.generatedContent}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CoverLetterHistory