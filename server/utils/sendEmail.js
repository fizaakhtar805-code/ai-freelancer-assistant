const nodemailer = require("nodemailer")

const sendEmail = async (to, subject, html) => {
  // Set up the connection to Gmail (explicit settings avoid IPv6 connection issues on some hosts)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Send the email
  await transporter.sendMail({
    from: `"AI Freelancer Assistant" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  })
}

module.exports = sendEmail