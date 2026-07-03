import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function InvoiceHistory() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadInvoices() {
    setError("")
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Please log in to view your history.")
      setLoading(false)
      return
    }
    try {
      const response = await axios.get("http://localhost:5000/api/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setInvoices(response.data)
    } catch (err) {
      setError("Failed to load invoices.")
    }
    setLoading(false)
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  async function handleDelete(id) {
    const token = localStorage.getItem("token")
    try {
      await axios.delete(`http://localhost:5000/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setInvoices(invoices.filter((i) => i._id !== id))
    } catch (err) {
      alert("Failed to delete.")
    }
  }

  async function handleExportPDF(id) {
    const token = localStorage.getItem("token")
    try {
      const response = await axios.get(`http://localhost:5000/api/invoices/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `invoice_${id}.pdf`)
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
      <h1>Invoice History</h1>
      <p className="page-subtitle">All your created invoices.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && invoices.length === 0 && !error && (
        <p className="placeholder-text">You haven't created any invoices yet.</p>
      )}

      <div className="history-list">
        {invoices.map((i) => (
          <div key={i._id} className="history-card">
            <div className="history-card-header">
              <div>
                <h3>{i.clientName} — ${i.totalAmount.toFixed(2)}</h3>
                <p className="history-meta">
                  Due: {i.dueDate || "N/A"} · Created {new Date(i.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="result-actions">
                <button onClick={() => handleExportPDF(i._id)}>Download PDF</button>
                <button onClick={() => handleDelete(i._id)} className="delete-btn">Delete</button>
              </div>
            </div>
            <div className="result-text">{i.services}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InvoiceHistory