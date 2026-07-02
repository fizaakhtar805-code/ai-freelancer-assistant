import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import VerifyEmail from "./pages/VerifyEmail"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Proposal from "./pages/Proposal"
import ProposalHistory from "./pages/ProposalHistory"
import CoverLetter from "./pages/CoverLetter"
import CoverLetterHistory from "./pages/CoverLetterHistory"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/proposal" element={<Proposal />} />
        <Route path="/proposal-history" element={<ProposalHistory />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        <Route path="/cover-letter-history" element={<CoverLetterHistory />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App