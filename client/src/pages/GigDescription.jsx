import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"

function GigDescription() {
  const navigate = useNavigate()
  const location = useLocation()

  const editingGig = location.state && location.state.gig ? location.state.gig : null

  const [editId, setEditId] = useState(editingGig ? editingGig._id : null)

  const [serviceCategory, setServiceCategory] = useState(editingGig ? editingGig.serviceCategory : "")
  const [skills, setSkills] = useState(editingGig ? editingGig.skills : "")
  const [experienceLevel, setExperienceLevel] = useState(editingGig ? editingGig.experienceLevel : "")
  const [deliveryTime, setDeliveryTime] = useState(editingGig ? editingGig.deliveryTime : "")
  const [features, setFeatures] = useState(editingGig ? editingGig.features : "")
  const [revisions, setRevisions] = useState(editingGig ? editingGig.revisions : "")

  const [description, setDescription] = useState(editingGig ? editingGig.generatedDescription : "")
  const [seoKeywords, setSeoKeywords] = useState(editingGig ? editingGig.seoKeywords : "")
  const [faqSuggestions, setFaqSuggestions] = useState(editingGig ? editingGig.faqSuggestions : "")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")

  const hasResult = description || seoKeywords || faqSuggestions

  async function handleGenerate() {
    setError("")
    setDescription("")
    setSeoKeywords("")
    setFaqSuggestions("")
    setSaveMsg("")
    setLoading(true)

    try {
      const response = await axios.post("http://localhost:5000/api/gigs/generate", {
        serviceCategory,
        skills,
        experienceLevel,
        deliveryTime,
        features,
        revisions,
      })
      setDescription(response.data.description)
      setSeoKeywords(response.data.seoKeywords)
      setFaqSuggestions(response.data.faqSuggestions)
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
    const fullText = `${description}\n\nSEO Keywords:\n${seoKeywords}\n\nFAQ Suggestions:\n${faqSuggestions}`
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSave() {
    setSaveMsg("")
    const token = localStorage.getItem("token")

    if (!token) {
      setSaveMsg("Please log in to save gig descriptions.")
      return
    }

    const gigData = {
      serviceCategory,
      skills,
      experienceLevel,
      deliveryTime,
      features,
      revisions,
      generatedDescription: description,
      seoKeywords,
      faqSuggestions,
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/gigs/${editId}`, gigData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSaveMsg("Gig description updated! ✅")
      } else {
        await axios.post("http://localhost:5000/api/gigs/save", gigData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setSaveMsg("Gig description saved! ✅")
      }
    } catch (err) {
      setSaveMsg("Failed to save. Please try again.")
    }
  }

  return (
    <div className="generator-page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>

      <h1>{editId ? "Edit Gig Description" : "Gig Description Generator"}</h1>
      <p className="page-subtitle">
        {editId ? "Update the details, tweak the text directly, or regenerate with AI." : "Fill in the details and let AI write your gig listing."}
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="generator-layout">
        {/* LEFT: the input form */}
        <div className="generator-form">
          <div className="form-group">
            <label>Service Category *</label>
            <input type="text" value={serviceCategory} onChange={(e) => setServiceCategory(e.target.value)} placeholder="e.g. Logo Design" />
          </div>

          <div className="form-group">
            <label>Skills *</label>
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. Illustrator, Branding" />
          </div>

          <div className="form-group">
            <label>Experience Level</label>
            <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
              <option value="">Select level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
          </div>

          <div className="form-group">
            <label>Delivery Time</label>
            <input type="text" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} placeholder="e.g. 3 days" />
          </div>

          <div className="form-group">
            <label>Features Included</label>
            <textarea rows="3" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="e.g. 3 concepts, source files, unlimited colors" />
          </div>

          <div className="form-group">
            <label>Revisions Offered</label>
            <input type="text" value={revisions} onChange={(e) => setRevisions(e.target.value)} placeholder="e.g. 2 revisions" />
          </div>

          <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        {/* RIGHT: the AI result */}
        <div className="generator-result">
          <div className="result-header">
            <h3>Generated Gig Listing</h3>
            {hasResult && (
              <div className="result-actions">
                <button onClick={handleCopy}>{copied ? "Copied!" : "Copy All"}</button>
                <button onClick={handleGenerate}>Regenerate</button>
                <button onClick={handleSave}>{editId ? "Update" : "Save"}</button>
              </div>
            )}
          </div>

          {saveMsg && <p style={{ color: "green", marginBottom: "10px" }}>{saveMsg}</p>}

          {loading && <p>AI is writing your gig listing... ✍️</p>}
          {!loading && !hasResult && <p className="placeholder-text">Your generated gig listing will appear here.</p>}

          {hasResult && (
            <>
              <label style={{ fontWeight: 600, fontSize: "14px", display: "block", margin: "12px 0 6px" }}>Description</label>
              <textarea
                className="result-text-editable"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="10"
              />

              <label style={{ fontWeight: 600, fontSize: "14px", display: "block", margin: "16px 0 6px" }}>SEO Keywords</label>
              <textarea
                className="result-text-editable"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                rows="3"
              />

              <label style={{ fontWeight: 600, fontSize: "14px", display: "block", margin: "16px 0 6px" }}>FAQ Suggestions</label>
              <textarea
                className="result-text-editable"
                value={faqSuggestions}
                onChange={(e) => setFaqSuggestions(e.target.value)}
                rows="6"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default GigDescription