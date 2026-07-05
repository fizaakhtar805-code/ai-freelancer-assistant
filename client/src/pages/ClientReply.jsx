import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"

function ClientReply() {
  const navigate = useNavigate()

  const [clientMessage, setClientMessage] = useState("")
  const [tone, setTone] = useState("Professional")

  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [copied, setCopied] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")

  function validate() {
    const errs = {}
    if (!clientMessage.trim()) errs.clientMessage = "Client message is required"
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleGenerate() {
    setError("")
    if (!validate()) return

    setResult("")
    setSaveMsg("")
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/clientreplies/generate`, {
        clientMessage,
        tone,
      })
      setResult(response.data.generatedReply)
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    }

    setLoading(false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSave() {
    setSaveMsg("")
    const token = localStorage.getItem("token")

    if (!token) {
      setSaveMsg("Please log in to save replies.")
      return
    }

    try {
      await axios.post(
        `${API_URL}/api/clientreplies/save`,
        { clientMessage, tone, generatedReply: result },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSaveMsg("Reply saved! ✅")
    } catch (err) {
      setSaveMsg("Failed to save. Please try again.")
    }
  }

  return (
    <div className="generator-page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>

      <h1>Client Reply Generator</h1>
      <p className="page-subtitle">Paste the client's message and let AI draft a professional reply.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="generator-layout">
        <div className="generator-form">
          <div className="form-group">
            <label>Client Message *</label>
            <textarea
              rows="8"
              className={fieldErrors.clientMessage ? "input-error" : ""}
              value={clientMessage}
              onChange={(e) => setClientMessage(e.target.value)}
              placeholder="Paste what the client wrote..."
            />
            {fieldErrors.clientMessage && <p className="field-error-text">{fieldErrors.clientMessage}</p>}
          </div>

          <div className="form-group">
            <label>Reply Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              <option>Professional</option>
              <option>Friendly</option>
              <option>Formal</option>
              <option>Apologetic</option>
              <option>Firm</option>
            </select>
          </div>

          <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        <div className="generator-result">
          <div className="result-header">
            <h3>Generated Reply</h3>
            {result && (
              <div className="result-actions">
                <button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
                <button onClick={handleGenerate}>Regenerate</button>
                <button onClick={handleSave}>Save</button>
              </div>
            )}
          </div>

          {saveMsg && <p style={{ color: "green", marginBottom: "10px" }}>{saveMsg}</p>}
          {loading && <p>AI is writing your reply... ✍️</p>}
          {!loading && !result && <p className="placeholder-text">Your generated reply will appear here.</p>}
          {result && (
            <textarea className="result-text-editable" value={result} onChange={(e) => setResult(e.target.value)} rows="14" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientReply