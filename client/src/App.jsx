import { useEffect } from "react"
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
import GigDescription from "./pages/GigDescription"
import GigDescriptionHistory from "./pages/GigDescriptionHistory"
import PricingCalculator from "./pages/PricingCalculator"
import PricingHistory from "./pages/PricingHistory"
import ClientReply from "./pages/ClientReply"
import ClientReplyHistory from "./pages/ClientReplyHistory"
import Invoice from "./pages/Invoice"
import InvoiceHistory from "./pages/InvoiceHistory"
import Contract from "./pages/Contract"
import ContractHistory from "./pages/ContractHistory"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

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
        <Route path="/gig-description" element={<GigDescription />} />
        <Route path="/gig-description-history" element={<GigDescriptionHistory />} />
        <Route path="/pricing-calculator" element={<PricingCalculator />} />
        <Route path="/pricing-history" element={<PricingHistory />} />
        <Route path="/client-reply" element={<ClientReply />} />
        <Route path="/client-reply-history" element={<ClientReplyHistory />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/invoice-history" element={<InvoiceHistory />} />
        <Route path="/contract" element={<Contract />} />
        <Route path="/contract-history" element={<ContractHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App