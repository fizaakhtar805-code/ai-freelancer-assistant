import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function PricingCalculator() {
  const navigate = useNavigate()

  const [hourlyRate, setHourlyRate] = useState("")
  const [estimatedHours, setEstimatedHours] = useState("")
  const [projectComplexity, setProjectComplexity] = useState("Medium")
  const [urgency, setUrgency] = useState("Standard")
  const [additionalCharges, setAdditionalCharges] = useState("")
  const [tax, setTax] = useState("")

  const [suggestedPrice, setSuggestedPrice] = useState(null)
  const [recommendedDeliveryTime, setRecommendedDeliveryTime] = useState("")
  const [marketAnalysis, setMarketAnalysis] = useState("")
  const [serviceImprovementTips, setServiceImprovementTips] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [saveMsg, setSaveMsg] = useState("")

  function validate() {
    const errs = {}
    if (!hourlyRate || parseFloat(hourlyRate) <= 0) errs.hourlyRate = "Enter a valid hourly rate"
    if (!estimatedHours || parseFloat(estimatedHours) <= 0) errs.estimatedHours = "Enter a valid number of hours"
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleCalculate() {
    setError("")
    setSaveMsg("")
    if (!validate()) return

    setSuggestedPrice(null)
    setLoading(true)

    try {
      const response = await axios.post("http://localhost:5000/api/pricing/generate", {
        hourlyRate,
        estimatedHours,
        projectComplexity,
        urgency,
        additionalCharges,
        tax,
      })
      setSuggestedPrice(response.data.suggestedPrice)
      setRecommendedDeliveryTime(response.data.recommendedDeliveryTime)
      setMarketAnalysis(response.data.marketAnalysis)
      setServiceImprovementTips(response.data.serviceImprovementTips)
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    }

    setLoading(false)
  }

  async function handleSave() {
    setSaveMsg("")
    const token = localStorage.getItem("token")
    if (!token) {
      setSaveMsg("Please log in to save.")
      return
    }

    try {
      await axios.post(
        "http://localhost:5000/api/pricing/save",
        {
          hourlyRate,
          estimatedHours,
          projectComplexity,
          urgency,
          additionalCharges,
          tax,
          suggestedPrice,
          recommendedDeliveryTime,
          marketAnalysis,
          serviceImprovementTips,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSaveMsg("Pricing saved! ✅")
    } catch (err) {
      setSaveMsg("Failed to save. Please try again.")
    }
  }

  return (
    <div className="generator-page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>

      <h1>Smart Pricing Calculator</h1>
      <p className="page-subtitle">Enter your project details to get a suggested price and advice.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="generator-layout">
        <div className="generator-form">
          <div className="form-group">
            <label>Hourly Rate ($) *</label>
            <input
              type="number"
              className={fieldErrors.hourlyRate ? "input-error" : ""}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="e.g. 25"
            />
            {fieldErrors.hourlyRate && <p className="field-error-text">{fieldErrors.hourlyRate}</p>}
          </div>

          <div className="form-group">
            <label>Estimated Hours *</label>
            <input
              type="number"
              className={fieldErrors.estimatedHours ? "input-error" : ""}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="e.g. 20"
            />
            {fieldErrors.estimatedHours && <p className="field-error-text">{fieldErrors.estimatedHours}</p>}
          </div>

          <div className="form-group">
            <label>Project Complexity</label>
            <select value={projectComplexity} onChange={(e) => setProjectComplexity(e.target.value)}>
              <option>Simple</option>
              <option>Medium</option>
              <option>Complex</option>
            </select>
          </div>

          <div className="form-group">
            <label>Urgency</label>
            <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
              <option>Standard</option>
              <option>Urgent</option>
              <option>Very Urgent</option>
            </select>
          </div>

          <div className="form-group">
            <label>Additional Charges ($)</label>
            <input type="number" value={additionalCharges} onChange={(e) => setAdditionalCharges(e.target.value)} placeholder="e.g. 20" />
          </div>

          <div className="form-group">
            <label>Tax (%)</label>
            <input type="number" value={tax} onChange={(e) => setTax(e.target.value)} placeholder="e.g. 5" />
          </div>

          <button className="btn-primary" onClick={handleCalculate} disabled={loading}>
            {loading ? "Calculating..." : "Calculate Price"}
          </button>
        </div>

        <div className="generator-result">
          <div className="result-header">
            <h3>Pricing Suggestion</h3>
            {suggestedPrice !== null && (
              <div className="result-actions">
                <button onClick={handleSave}>Save</button>
              </div>
            )}
          </div>

          {saveMsg && <p style={{ color: "green", marginBottom: "10px" }}>{saveMsg}</p>}
          {loading && <p>Calculating your price... 💰</p>}
          {!loading && suggestedPrice === null && <p className="placeholder-text">Your pricing suggestion will appear here.</p>}

          {suggestedPrice !== null && (
            <>
              <h2 style={{ color: "var(--ink)", marginBottom: "16px" }}>Suggested Price: ${suggestedPrice}</h2>

              <label style={{ fontWeight: 600, fontSize: "14px", display: "block", margin: "12px 0 6px" }}>Recommended Delivery Time</label>
              <p className="result-text">{recommendedDeliveryTime}</p>

              <label style={{ fontWeight: 600, fontSize: "14px", display: "block", margin: "16px 0 6px" }}>Market Analysis</label>
              <p className="result-text">{marketAnalysis}</p>

              <label style={{ fontWeight: 600, fontSize: "14px", display: "block", margin: "16px 0 6px" }}>Service Improvement Tips</label>
              <p className="result-text">{serviceImprovementTips}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PricingCalculator