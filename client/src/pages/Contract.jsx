import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Contract() {
  const navigate = useNavigate()

  const [clientName, setClientName] = useState("")
  const [freelancerName, setFreelancerName] = useState("")
  const [projectScope, setProjectScope] = useState("")
  const [timeline, setTimeline] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("")
  const [termsAndConditions, setTermsAndConditions] = useState("")

  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")

  async function handleGenerate() {
    setError("")
    setResult("")
    setSaveMsg("")
    setLoading(true)

    try {
      const response = await axios.post("http://localhost:5000/api/contracts/generate", {
        clientName,
        freelancerName,
        projectScope,
        timeline,
        paymentTerms,
        termsAndConditions,
      })
      setResult(response.data.generatedContract)
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
      setSaveMsg("Please log in to save contracts.")
      return
    }

    try {
      await axios.post(
        "http://localhost:5000/api/contracts/save",
        { clientName, freelancerName, projectScope, timeline, paymentTerms, termsAndConditions, generatedContract: result },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSaveMsg("Contract saved! ✅")
    } catch (err) {
      setSaveMsg("Failed to save. Please try again.")
    }
  }

  return (
    <div className="generator-page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>

      <h1>Contract Generator</h1>
      <p className="page-subtitle">Fill in the details and let AI draft a professional contract.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="generator-layout">
        <div className="generator-form">
          <div className="form-group">
            <label>Client Name *</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Sarah Malik" />
          </div>

          <div className="form-group">
            <label>Freelancer Name *</label>
            <input type="text" value={freelancerName} onChange={(e) => setFreelancerName(e.target.value)} placeholder="e.g. Fiza Akhtar" />
          </div>

          <div className="form-group">
            <label>Project Scope *</label>
            <textarea rows="4" value={projectScope} onChange={(e) => setProjectScope(e.target.value)} placeholder="Describe the work to be done..." />
          </div>

          <div className="form-group">
            <label>Timeline</label>
            <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g. 3 weeks" />
          </div>

          <div className="form-group">
            <label>Payment Terms</label>
            <input type="text" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="e.g. 50% upfront, 50% on delivery" />
          </div>

          <div className="form-group">
            <label>Terms & Conditions</label>
            <textarea rows="3" value={termsAndConditions} onChange={(e) => setTermsAndConditions(e.target.value)} placeholder="Any additional terms..." />
          </div>

          <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        <div className="generator-result">
          <div className="result-header">
            <h3>Generated Contract</h3>
            {result && (
              <div className="result-actions">
                <button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
                <button onClick={handleGenerate}>Regenerate</button>
                <button onClick={handleSave}>Save</button>
              </div>
            )}
          </div>

          {saveMsg && <p style={{ color: "green", marginBottom: "10px" }}>{saveMsg}</p>}
          {loading && <p>AI is drafting your contract... ✍️</p>}
          {!loading && !result && <p className="placeholder-text">Your generated contract will appear here.</p>}
          {result && (
            <textarea className="result-text-editable" value={result} onChange={(e) => setResult(e.target.value)} rows="20" />
          )}
        </div>
      </div>
    </div>
  )
}

export default Contract