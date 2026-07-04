import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Settings() {
  const navigate = useNavigate()

  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark")
  const [emailNotifs, setEmailNotifs] = useState(localStorage.getItem("notif_email") !== "false")
  const [saveReminders, setSaveReminders] = useState(localStorage.getItem("notif_reminders") !== "false")
  const [language, setLanguage] = useState(localStorage.getItem("language") || "English")

  function toggleTheme() {
    const newTheme = darkMode ? "light" : "dark"
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    setDarkMode(!darkMode)
  }

  function toggleEmailNotifs() {
    const newVal = !emailNotifs
    setEmailNotifs(newVal)
    localStorage.setItem("notif_email", newVal)
  }

  function toggleSaveReminders() {
    const newVal = !saveReminders
    setSaveReminders(newVal)
    localStorage.setItem("notif_reminders", newVal)
  }

  function handleLanguageChange(e) {
    setLanguage(e.target.value)
    localStorage.setItem("language", e.target.value)
  }

  return (
    <div className="generator-page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>

      <h1>Application Settings</h1>
      <p className="page-subtitle">Customize your experience.</p>

      {/* Theme Settings */}
      <div className="settings-card">
        <h3>Theme</h3>
        <p className="settings-desc">Choose how the app looks.</p>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Dark Mode</div>
            <div className="settings-row-sub">Switch between light and dark appearance</div>
          </div>
          <div className={`toggle-switch ${darkMode ? "active" : ""}`} onClick={toggleTheme}></div>
        </div>
      </div>

      {/* API Key Settings */}
      <div className="settings-card">
        <h3>API Key</h3>
        <p className="settings-desc">Your AI provider connection status.</p>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Groq API</div>
            <div className="settings-row-sub">Connected — model: llama-3.3-70b-versatile</div>
          </div>
          <span style={{ color: "var(--success)", fontWeight: 700, fontSize: "13px" }}>● Active</span>
        </div>
        <p style={{ fontSize: "12.5px", color: "var(--ink-muted)", marginTop: "12px" }}>
          To change your API key, update <code>GROQ_API_KEY</code> in your server's <code>.env</code> file and restart the server. For security, API keys can't be edited from this interface.
        </p>
      </div>

      {/* Notification Settings */}
      <div className="settings-card">
        <h3>Notifications</h3>
        <p className="settings-desc">Manage how you're notified.</p>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Email Notifications</div>
            <div className="settings-row-sub">Receive updates about your account via email</div>
          </div>
          <div className={`toggle-switch ${emailNotifs ? "active" : ""}`} onClick={toggleEmailNotifs}></div>
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Save Reminders</div>
            <div className="settings-row-sub">Get reminded to save generated content before leaving a page</div>
          </div>
          <div className={`toggle-switch ${saveReminders ? "active" : ""}`} onClick={toggleSaveReminders}></div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="settings-card">
        <h3>Language</h3>
        <p className="settings-desc">Choose your preferred interface language.</p>
        <div className="form-group" style={{ maxWidth: "300px" }}>
          <select value={language} onChange={handleLanguageChange}>
            <option>English</option>
            <option>Urdu</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
        <p style={{ fontSize: "12.5px", color: "var(--ink-muted)" }}>
          Note: full translation support is not yet implemented — the interface currently displays in English regardless of this setting.
        </p>
      </div>
    </div>
  )
}

export default Settings