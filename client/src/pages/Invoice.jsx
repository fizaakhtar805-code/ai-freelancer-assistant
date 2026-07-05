import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"

function Invoice() {
  const navigate = useNavigate()

  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [projectDetails, setProjectDetails] = useState("")
  const [services, setServices] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [tax, setTax] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [saveMsg, setSaveMsg] = useState("")

  async function handleCreate() {
    setError("")
    setSaveMsg("")

    if (!clientName || !services || !amount) {
      setError("Client name, services, and amount are required")
      return
    }

    setLoading(true)
    const token = localStorage.getItem("token")

    if (!token) {
      setError("Please log in to create an invoice.")
      setLoading(false)
      return
    }

    try {
      await axios.post(
        `${API_URL}/api/invoices/save`,
        { clientName, clientEmail, projectDetails, services, amount, dueDate, tax },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSaveMsg("Invoice created! ✅ Check Invoice History to download it.")
      setClientName("")
      setClientEmail("")
      setProjectDetails("")
      setServices("")
      setAmount("")
      setDueDate("")
      setTax("")
    } catch (err) {
      setError("Failed to create invoice. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="generator-page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>

      <h1>Invoice Generator</h1>
      <p className="page-subtitle">Fill in the details to create a downloadable invoice.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {saveMsg && <p style={{ color: "green" }}>{saveMsg}</p>}

      <div className="generator-form" style={{ maxWidth: "600px" }}>
        <div className="form-group">
          <label>Client Name *</label>
          <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. John Smith" />
        </div>

        <div className="form-group">
          <label>Client Email</label>
          <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="e.g. john@example.com" />
        </div>

        <div className="form-group">
          <label>Project Details</label>
          <textarea rows="3" value={projectDetails} onChange={(e) => setProjectDetails(e.target.value)} placeholder="Brief description of the project..." />
        </div>

        <div className="form-group">
          <label>Services *</label>
          <textarea rows="3" value={services} onChange={(e) => setServices(e.target.value)} placeholder="e.g. Website Design, Development, Testing" />
        </div>

        <div className="form-group">
          <label>Amount ($) *</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 500" />
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Tax (%)</label>
          <input type="number" value={tax} onChange={(e) => setTax(e.target.value)} placeholder="e.g. 5" />
        </div>

        <button className="btn-primary" onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Generate Invoice"}
        </button>
      </div>
    </div>
  )
}

export default Invoice