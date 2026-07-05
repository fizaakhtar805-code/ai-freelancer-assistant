import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"

function Profile() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [profilePicture, setProfilePicture] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saveMsg, setSaveMsg] = useState("")
  const [passwordMsg, setPasswordMsg] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Please log in to view your profile.")
        setLoading(false)
        return
      }
      try {
        const response = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setName(response.data.name)
        setEmail(response.data.email)
        setBio(response.data.bio)
        setJobTitle(response.data.jobTitle)
        setProfilePicture(response.data.profilePicture)
      } catch (err) {
        setError("Failed to load profile.")
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  function handlePictureChange(e) {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setSaveMsg("Image too large. Please choose one under 2MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => setProfilePicture(reader.result)
    reader.readAsDataURL(file)
  }

  async function handleSaveProfile() {
    setSaveMsg("")
    const token = localStorage.getItem("token")

    try {
      await axios.put(
        `${API_URL}/api/profile`,
        { name, bio, jobTitle, profilePicture },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userObj = JSON.parse(storedUser)
        userObj.name = name
        localStorage.setItem("user", JSON.stringify(userObj))
      }

      setSaveMsg("Profile updated! ✅")
    } catch (err) {
      setSaveMsg("Failed to update profile.")
    }
  }

  async function handleChangePassword() {
    setPasswordMsg("")

    if (!currentPassword || !newPassword) {
      setPasswordMsg("Please fill in both password fields.")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match.")
      return
    }

    const token = localStorage.getItem("token")
    try {
      await axios.put(
        `${API_URL}/api/profile/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setPasswordMsg("Password changed successfully! ✅")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      if (err.response && err.response.data) {
        setPasswordMsg(err.response.data.message)
      } else {
        setPasswordMsg("Failed to change password.")
      }
    }
  }

  if (loading) return <div className="generator-page"><p>Loading profile...</p></div>

  return (
    <div className="generator-page">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>

      <h1>My Profile</h1>
      <p className="page-subtitle">Manage your account details and security.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="generator-layout">
        <div className="generator-form">
          <h3 style={{ marginBottom: "16px" }}>Profile Details</h3>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                background: "var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
                border: "2px solid var(--gold)",
              }}
            >
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "36px", color: "var(--ink-muted)" }}>{name ? name[0].toUpperCase() : "?"}</span>
              )}
            </div>
            <label className="btn-primary" style={{ display: "inline-block", width: "auto", padding: "8px 16px", fontSize: "13px", cursor: "pointer" }}>
              Upload Picture
              <input type="file" accept="image/*" onChange={handlePictureChange} style={{ display: "none" }} />
            </label>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} disabled style={{ background: "#F0F1F5", cursor: "not-allowed" }} />
          </div>

          <div className="form-group">
            <label>Job Title</label>
            <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Full Stack Developer" />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea rows="3" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio about yourself..." />
          </div>

          {saveMsg && <p style={{ color: saveMsg.includes("✅") ? "green" : "red", marginBottom: "10px" }}>{saveMsg}</p>}

          <button className="btn-primary" onClick={handleSaveProfile}>Save Profile</button>
        </div>

        <div className="generator-result">
          <h3 style={{ marginBottom: "16px" }}>Change Password</h3>

          <div className="form-group">
            <label>Current Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowCurrent(!showCurrent)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: "16px" }}
              >
                {showCurrent ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowNew(!showNew)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: "16px" }}
              >
                {showNew ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: "16px" }}
              >
                {showConfirm ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {passwordMsg && (
            <p style={{ color: passwordMsg.includes("✅") ? "green" : "red", marginBottom: "10px" }}>{passwordMsg}</p>
          )}

          <button className="btn-primary" onClick={handleChangePassword}>Change Password</button>
        </div>
      </div>
    </div>
  )
}

export default Profile