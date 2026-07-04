import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"

function CoverLetter() {
  const navigate = useNavigate()
  const location = useLocation()

  const editingLetter = location.state && location.state.coverLetter ? location.state.coverLetter : null

  const [editId, setEditId] = useState(editingLetter ? editingLetter._id : null)

  const [jobTitle, setJobTitle] = useState(editingLetter ? editingLetter.jobTitle : "")
  const [companyName, setCompanyName] = useState(editingLetter ? editingLetter.companyName : "")
  const [experience, setExperience] = useState(editingLetter ? editingLetter.experience : "")
  const [skills, setSkills] = useState(editingLetter ? editingLetter.skills : "")
  const [portfolioUrl, setPortfolioUrl] = useState(editingLetter ? editingLetter.portfolioUrl : "")
  const [tone, setTone] = useState(editingLetter ? editingLetter.tone : "Professional")

  const [result, setResult] = useState(editingLetter ? editingLetter.generatedContent : "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [copied, setCopied] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")

  function validate() {
    const errs = {}
    if (!jobTitle.trim()) errs.jobTitle = "Job title is required"
    if (!companyName.trim()) errs.companyName = "Company name is required"
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
      const response = await axios.post("http://localhost:5000/api/coverletters/generate", {
        jobTitle,
        companyName,
        experience,
        skills,
        portfolioUrl,
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
      setSaveMsg("Please log in to save cover letters.")
      return
    }

    const letterData = {
      jobTitle,
      companyName,
      experience,
      skills,
      portfolioUrl,
      tone,
      generatedContent: result,
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/coverletters/${editId}`, letterData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSaveMsg("Cover letter updated! ✅")
      } else {
        await axios.post("http://localhost:5000/api/coverletters/save", letterData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSaveMsg("Cover letter saved! ✅")
      }
    } catch (err) {
      setSaveMsg("Failed to save. Please try again.")
    }
  }

  return (
    <div className="generator-page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>

      <h1>{editId ? "Edit Cover Letter" : "Cover Letter Generator"}</h1>
      <p className="page-subtitle">
        {editId ? "Update the details, tweak the text directly, or regenerate with AI." : "Fill in the details and let AI write a professional cover letter."}
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="generator-layout">
        <div className="generator-form">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              className={fieldErrors.jobTitle ? "input-error" : ""}
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Frontend Developer"
            />
            {fieldErrors.jobTitle && <p className="field-error-text">{fieldErrors.jobTitle}</p>}
          </div>

          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              className={fieldErrors.companyName ? "input-error" : ""}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. TechNova Inc."
            />
            {fieldErrors.companyName && <p className="field-error-text">{fieldErrors.companyName}</p>}
          </div>

          <div className="form-group">
            <label>Experience</label>
            <textarea rows="4" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Briefly describe your relevant experience..." />
          </div>

          <div className="form-group">
            <label>Skills</label>
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. React, Node.js, UI Design" />
          </div>

          <div className="form-group">
            <label>Portfolio URL</label>
            <input type="text" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="e.g. https://myportfolio.com" />
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
            <h3>Generated Cover Letter</h3>
            {result && (
              <div className="result-actions">
                <button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</button>
                <button onClick={handleGenerate}>Regenerate</button>
                <button onClick={handleSave}>{editId ? "Update" : "Save"}</button>
              </div>
            )}
          </div>

          {saveMsg && <p style={{ color: "green", marginBottom: "10px" }}>{saveMsg}</p>}

          {loading && <p>AI is writing your cover letter... ✍️</p>}
          {!loading && !result && <p className="placeholder-text">Your generated cover letter will appear here.</p>}
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

export default CoverLetter