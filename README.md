# AI Freelancer Assistant

An AI-powered web application that helps freelancers automate their daily workflow — generating proposals, cover letters, gig descriptions, client replies, invoices, contracts, and smart pricing suggestions.

Built as a 5-day internship project at **Softgrid Solutions**.

## Live Demo

- **Live App:** https://ai-freelancer-assistant-chi.vercel.app
- **GitHub Repository:** https://github.com/fizaakhtar805-code/ai-freelancer-assistant

## Tech Stack

**Frontend:** React (Vite), React Router
**Backend:** Node.js, Express.js
**Database:** MongoDB Atlas (Mongoose)
**Authentication:** JWT, bcrypt password hashing
**Email:** Nodemailer (Gmail App Password) — email verification, password reset
**AI Integration:** Groq API (model: `llama-3.3-70b-versatile`)
**PDF Generation:** pdfkit
**Security:** Helmet, express-rate-limit

## Features

### Authentication
- Signup, Login, Email Verification, Forgot/Reset Password
- JWT-based sessions, hashed passwords
- Show/hide password toggle

### Dashboard
- Live widget counts (Proposals, Cover Letters, Invoices)
- Recent Activities feed (aggregated across all modules)
- Grouped Quick Actions with icons
- Profile avatar with dropdown menu (Account Settings, App Settings, Log Out)

### Proposal Generator
AI-generated freelance proposals from client/project details. Full CRUD (Create, Edit, Delete), Save, Copy, History, PDF export.

### Cover Letter Generator
AI-generated cover letters from job/company/experience details. Full CRUD, Copy, History, PDF export.

### Gig Description Generator
AI-generated gig listings (description, SEO keywords, FAQ suggestions) from service details. Full CRUD, Copy, History, PDF export.

### Smart Pricing Calculator
Formula-based price calculation (hourly rate × hours × complexity/urgency multipliers + charges + tax) paired with AI-generated market analysis, delivery time recommendation, and improvement tips. Save, History, PDF export.

### Client Reply Generator
AI-generated professional replies to client messages, with tone selection. Copy, Save, History.

### Invoice Generator
Formula-based invoice creation (no AI — pure calculation) with client/project/service details. Save, History, downloadable PDF.

### Contract Generator
AI-generated freelance service contracts from client/freelancer/scope/payment details. Copy, Save, History, PDF export.

### User Profile
Edit name, job title, bio; upload profile picture; change password.

### Application Settings
- Working light/dark theme toggle (applies app-wide)
- API key connection status display
- Notification preference toggles
- Language preference selector

### Polish
- Fully responsive design (desktop, tablet, mobile)
- Frontend + backend form validation on all data-entry pages
- Security hardening: Helmet security headers, rate limiting (general + AI-specific), input length limits

## Project Structure

```
AI-FREELANCER-ASSISTANT/
├── client/                 # React (Vite) frontend
│   └── src/
│       ├── pages/           # All page components
│       ├── App.jsx          # Routes
│       └── index.css        # Global styles (CSS variables for theming)
├── server/                  # Node/Express backend
│   ├── config/               # AI helper (Groq integration)
│   ├── middleware/           # JWT auth middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/                 # API routes
│   └── server.js              # Entry point
```

## Getting Started Locally

### Prerequisites
- Node.js installed
- A MongoDB Atlas account (or local MongoDB)
- A Groq API key (free at [console.groq.com](https://console.groq.com))
- A Gmail account with an App Password (for email features)

### Setup

1. Clone the repository
   ```
   git clone https://github.com/fizaakhtar805-code/ai-freelancer-assistant.git
   cd ai-freelancer-assistant
   ```

2. Install backend dependencies
   ```
   cd server
   npm install
   ```

3. Create a `.env` file inside `server/` with:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   CLIENT_URL=http://localhost:5173
   GROQ_API_KEY=your_groq_api_key
   ```

4. Start the backend
   ```
   node server.js
   ```

5. In a new terminal, install frontend dependencies
   ```
   cd client
   npm install
   ```

6. Start the frontend
   ```
   npm run dev
   ```

7. Open `http://localhost:5173` in your browser

## API Overview

| Route | Description |
|---|---|
| `/api/auth` | Signup, login, email verification, password reset |
| `/api/proposals` | Proposal CRUD, AI generation, PDF export |
| `/api/coverletters` | Cover letter CRUD, AI generation, PDF export |
| `/api/gigs` | Gig description CRUD, AI generation, PDF export |
| `/api/pricing` | Pricing calculation, AI advice, PDF export |
| `/api/clientreplies` | Client reply CRUD, AI generation |
| `/api/invoices` | Invoice CRUD, PDF export |
| `/api/contracts` | Contract CRUD, AI generation, PDF export |
| `/api/profile` | Profile view/update, password change |

## Author

**Fiza Akhtar** — BSAI Intern, Softgrid Solutions
