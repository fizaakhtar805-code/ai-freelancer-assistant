function Dashboard() {
  // Read the logged-in user's info from browser storage
  const storedUser = localStorage.getItem("user")
  const user = storedUser ? JSON.parse(storedUser) : null
  const userName = user ? user.name : "Guest"

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="subtitle">Welcome back, {userName}!</p>

      <div className="widgets">
        <div className="widget-card">
          <h2>0</h2>
          <p>Total Proposals</p>
        </div>

        <div className="widget-card">
          <h2>0</h2>
          <p>Cover Letters</p>
        </div>

        <div className="widget-card">
          <h2>0</h2>
          <p>Active Clients</p>
        </div>

        <div className="widget-card">
          <h2>0</h2>
          <p>Total Invoices</p>
        </div>

        <div className="widget-card">
          <h2>100</h2>
          <p>AI Credits</p>
        </div>
      </div>

      <h3 className="section-title">Recent Activities</h3>
      <div className="activity-box">No activities yet.</div>

      <h3 className="section-title">Quick Actions</h3>
      <div className="quick-actions">
        <button>Create Proposal</button>
        <button>Write Cover Letter</button>
        <button>Create Gig</button>
        <button>Generate Invoice</button>
        <button>Create Contract</button>
      </div>
    </div>
  )
}

export default Dashboard