import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"

function Proposal() {
  const navigate = useNavigate()
  const location = useLocation()

  const editingProposal = location.state && location.state.proposal ? location.state.proposal : null

  const [editId, setEditId] = useState(editingProposal ? editingProposal._id : null)

  const [clientName, setClientName] = useState(editingProposal ? editingProposal.clientName : "")
  const [projectTitle, setProjectTitle] = useState(editingProposal ? editingProposal.projectTitle : "")
  const [projectDescription, setProjectDescription] = useState(editingProposal ? editingProposal.projectDescription : "")
  const [skills, setSkills] = useState(editingProposal ? editingProposal.skills : "")
  const [budget, setBudget] = useState(editingProposal ? editingProposal.budget : "")
  const [timeline, setTimeline] = useState(editingProposal ? editingProposal.timeline : "")
  const [tone, setTone] = useState(editingProposal ? editingProposal.tone : "Professional")

  const [result, setResult] = useState(editingProposal ? editingProposal.generatedContent : "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [copied, setCopied] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")

  function validate() {
    const errs = {}
    if (!projectTitle.trim()) errs.projectTitle = "Project title is required"
    if (!projectDescription.trim()) errs.projectDescription = "Project description is required"
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
      const response = await axios.post("http://localhost:5000/api/proposals/generate", {
        clientName,
        projectTitle,
        projectDescription,
        skills,
        budget,
        timeline,
        tone,
      })
      setResult(response.data.generatedContent)
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
      setSaveMsg("Please log in to save proposals.")
      return
    }

    const proposalData = {
      clientName,
      projectTitle,
      projectDescription,
      skills,
      budget,
      timeline,
      tone,
      generatedContent: result,
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/proposals/${editId}`, proposalData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSaveMsg("Proposal updated! ✅")
      } else {
        await axios.post("http://localhost:5000/api/proposals/save", proposalData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSaveMsg("Proposal saved! ✅")
      }
    } catch (err) {
      setSaveMsg("Failed to save. Please try again.")
    }
  }

  return (
    <div className="generator-page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>

      <h1>{editId ? "Edit Proposal" : "Proposal Generator"}</h1>
      <p className="page-subtitle">
        {editId ? "Update the details, tweak the text directly, or regenerate with AI." : "Fill in the details and let AI write a professional proposal."}
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="generator-layout">
        <div className="generator-form">
          <div className="form-group">
            <label>Client Name</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. John Smith" />
          </div>

          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              className={fieldErrors.projectTitle ? "input-error" : ""}
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. E-commerce Website"
            />
            {fieldErrors.projectTitle && <p className="field-error-text">{fieldErrors.projectTitle}</p>}
          </div>

          <div className="form-group">
            <label>Project Description *</label>
            <textarea
              rows="4"
              className={fieldErrors.projectDescription ? "input-error" : ""}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe what the client needs..."
            />
            {fieldErrors.projectDescription && <p className="field-error-text">{fieldErrors.projectDescription}</p>}
          </div>

          <div className="form-group">
            <label>Your Skills</label>
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. React, Node.js, UI Design" />
          </div>

          <div className="form-group">
            <label>Budget</label>
            <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $500" />
          </div>

          <div className="form-group">
            <label>Timeline</label>
            <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g. 2 weeks" />
          </div>

          <div className="form-group">
            <label>Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              <option>Professional</option>
              <option>Friendly</option>
              <option>Formal</option>
              <option>Persuasive</option>
              <option>Confident</option>
            </select>
          </div>

          <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        <div className="generator-result">
          <div className="result-header">
            <h3>Generated Proposal</h3>
            {result && (
              <div className="result-actions">
                <button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
                <button onClick={handleGenerate}>Regenerate</button>
                <button onClick={handleSave}>{editId ? "Update" : "Save"}</button>
              </div>
            )}
          </div>

          {saveMsg && <p style={{ color: "green", marginBottom: "10px" }}>{saveMsg}</p>}

          {loading && <p>AI is writing your proposal... ✍️</p>}
          {!loading && !result && <p className="placeholder-text">Your generated proposal will appear here.</p>}
          {result && (
            <textarea
              className="result-text-editable"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              rows="18"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Proposal